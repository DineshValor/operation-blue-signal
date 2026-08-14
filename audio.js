/*
 * RESISTANCE INTELLIGENCE NETWORK
 * AUDIO ENGINE v10
 *
 * Procedural Web Audio API.
 * Sounds are intentionally triggered AFTER an action/line
 * finishes typing, rather than while it is being typed.
 *
 * Mobile autoplay:
 * The first user interaction unlocks the audio context.
 */

(function () {

    "use strict";

    var ctx = null;
    var master = null;
    var unlocked = false;

    var lastTypedTick = 0;
    var lastTypedLength = -1;
    var played = Object.create(null);

    var MASTER_VOLUME = 0.18;


    function getContext() {

        if (ctx) {
            return ctx;
        }

        var AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        ctx = new AudioContext();

        master = ctx.createGain();
        master.gain.value = MASTER_VOLUME;
        master.connect(ctx.destination);

        return ctx;
    }


    function unlock() {

        var audio = getContext();

        if (!audio) {
            return;
        }

        if (audio.state === "suspended") {
            audio.resume();
        }

        unlocked = true;
    }


    [
        "pointerdown",
        "touchstart",
        "keydown"
    ].forEach(function (eventName) {

        window.addEventListener(
            eventName,
            unlock,
            {
                passive: true
            }
        );

    });


    function safeGain(value) {
        return Math.max(0.0001, value);
    }


    /*
     * Cinematic event gain:
     * major story beats are intentionally stronger than
     * ordinary interface sounds.
     */
    function cinematicGain(value) {
        return Math.min(0.22, value * 1.28);
    }


    function tone(
        frequency,
        duration,
        type,
        volume,
        delay,
        attack
    ) {

        if (!unlocked) {
            return;
        }

        var audio = getContext();

        if (!audio || !master) {
            return;
        }

        var start =
            audio.currentTime +
            (delay || 0);

        var osc =
            audio.createOscillator();

        var gain =
            audio.createGain();

        osc.type =
            type || "sine";

        osc.frequency.setValueAtTime(
            frequency,
            start
        );

        var peak =
            safeGain(
                volume === undefined
                    ? 0.08
                    : volume
            );

        var attackTime =
            attack === undefined
                ? 0.012
                : attack;

        gain.gain.setValueAtTime(
            0.0001,
            start
        );

        gain.gain.exponentialRampToValueAtTime(
            peak,
            start + attackTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            start + duration
        );

        osc.connect(gain);
        gain.connect(master);

        osc.start(start);
        osc.stop(
            start +
            duration +
            0.04
        );
    }


    function sweep(
        from,
        to,
        duration,
        type,
        volume,
        delay
    ) {

        if (!unlocked) {
            return;
        }

        var audio = getContext();

        if (!audio || !master) {
            return;
        }

        var start =
            audio.currentTime +
            (delay || 0);

        var osc =
            audio.createOscillator();

        var gain =
            audio.createGain();

        osc.type =
            type || "sine";

        osc.frequency.setValueAtTime(
            from,
            start
        );

        osc.frequency.exponentialRampToValueAtTime(
            to,
            start + duration
        );

        gain.gain.setValueAtTime(
            0.0001,
            start
        );

        gain.gain.exponentialRampToValueAtTime(
            safeGain(volume || 0.08),
            start + 0.025
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            start + duration
        );

        osc.connect(gain);
        gain.connect(master);

        osc.start(start);
        osc.stop(
            start +
            duration +
            0.05
        );
    }


    function noise(
        duration,
        volume,
        delay
    ) {

        if (!unlocked) {
            return;
        }

        var audio = getContext();

        if (!audio || !master) {
            return;
        }

        var length =
            Math.max(
                1,
                Math.floor(
                    audio.sampleRate *
                    duration
                )
            );

        var buffer =
            audio.createBuffer(
                1,
                length,
                audio.sampleRate
            );

        var data =
            buffer.getChannelData(0);

        for (var i = 0; i < length; i++) {
            data[i] =
                Math.random() * 2 - 1;
        }

        var source =
            audio.createBufferSource();

        var gain =
            audio.createGain();

        var start =
            audio.currentTime +
            (delay || 0);

        source.buffer = buffer;

        gain.gain.setValueAtTime(
            0.0001,
            start
        );

        gain.gain.exponentialRampToValueAtTime(
            safeGain(volume || 0.04),
            start + 0.008
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            start + duration
        );

        source.connect(gain);
        gain.connect(master);

        source.start(start);
        source.stop(
            start +
            duration +
            0.02
        );
    }


    /* -------------------------------------------------
       SMALL INTERFACE SOUNDS
       ------------------------------------------------- */

    function typingClick() {

        tone(
            900 +
            Math.random() * 280,
            0.025,
            "square",
            0.028
        );
    }


    function confirm() {

        tone(660, 0.10, "sine", 0.075);
        tone(990, 0.18, "sine", 0.065, 0.095);
        tone(1320, 0.24, "sine", 0.045, 0.19);
    }


    function secure() {

        tone(440, 0.12, "triangle", 0.065);
        tone(660, 0.13, "triangle", 0.075, 0.12);
        tone(880, 0.22, "sine", 0.065, 0.25);
    }


    function warning() {

        tone(235, 0.18, "square", 0.10);
        tone(165, 0.24, "square", 0.075, 0.19);
        tone(120, 0.30, "sawtooth", 0.045, 0.39);
    }


    function error() {

        tone(180, 0.17, "sawtooth", 0.11);
        tone(120, 0.24, "sawtooth", 0.085, 0.12);
    }


    function accessGranted() {

        tone(440, 0.12, "sine", 0.075);
        tone(660, 0.13, "sine", 0.085, 0.11);
        tone(880, 0.16, "sine", 0.075, 0.23);
        tone(1320, 0.35, "sine", 0.065, 0.38);
    }


    function decrypt() {

        sweep(
            260,
            900,
            0.45,
            "triangle",
            0.08
        );

        tone(660, 0.12, "sine", 0.07, 0.44);
        tone(990, 0.18, "sine", 0.075, 0.56);
        tone(1320, 0.30, "sine", 0.055, 0.72);
    }


    function copied() {

        tone(880, 0.08, "square", 0.07);
        tone(1180, 0.13, "sine", 0.075, 0.08);
    }


    function packageComplete() {

        tone(440, 0.10, "triangle", 0.065);
        tone(550, 0.12, "triangle", 0.065, 0.10);
        tone(660, 0.18, "sine", 0.075, 0.23);
    }


    /* -------------------------------------------------
       SELF-DESTRUCT
       ------------------------------------------------- */

    function selfDestructStart() {

        /*
         * Three-stage siren ramp.
         * This is intentionally stronger than ordinary
         * terminal sounds.
         */

        sweep(
            170,
            520,
            0.75,
            "sawtooth",
            cinematicGain(0.13)
        );

        sweep(
            520,
            170,
            0.75,
            "sawtooth",
            cinematicGain(0.11),
            0.78
        );

        tone(
            95,
            0.55,
            "sine",
            cinematicGain(0.09),
            1.58
        );
    }


    function countdown(seconds) {

        var intensity =
            seconds <= 2
                ? 0.14
                : 0.11;

        var base =
            170 +
            (5 - seconds) * 28;

        /*
         * Main alarm pulse.
         */
        tone(
            base,
            0.28,
            "square",
            cinematicGain(intensity)
        );

        /*
         * Higher warning pulse.
         */
        tone(
            base * 1.55,
            0.16,
            "sawtooth",
            cinematicGain(intensity * 0.48),
            0.16
        );

        /*
         * Low sub pulse makes the countdown
         * physically more noticeable on phone speakers.
         */
        tone(
            72,
            0.22,
            "sine",
            cinematicGain(intensity * 0.42),
            0.02
        );
    }


    function purge() {

        noise(0.24, cinematicGain(0.06));

        sweep(
            900,
            90,
            0.85,
            "sawtooth",
            cinematicGain(0.10),
            0.04
        );

        tone(
            55,
            0.85,
            "sine",
            cinematicGain(0.10),
            0.65
        );

        tone(
            110,
            0.38,
            "triangle",
            cinematicGain(0.065),
            1.10
        );
    }


    /* -------------------------------------------------
       FINAL BIRTHDAY REVEAL
       ------------------------------------------------- */

    function birthdayReveal() {

        /*
         * A longer 5.2-second cinematic sequence:
         *
         * 0.00  low arrival
         * 0.45  first chord
         * 1.10  second chord
         * 1.85  bright reveal
         * 2.75  warm high note
         * 3.65  final resolving chord
         * 4.60  soft tail
         */

        sweep(
            130,
            260,
            1.05,
            "sine",
            cinematicGain(0.065)
        );

        tone(
            261.63,
            0.70,
            "sine",
            cinematicGain(0.075),
            0.35
        );

        tone(
            329.63,
            0.75,
            "sine",
            cinematicGain(0.065),
            0.35
        );

        tone(
            392.00,
            0.90,
            "sine",
            cinematicGain(0.060),
            0.35
        );

        tone(
            523.25,
            0.90,
            "triangle",
            cinematicGain(0.075),
            1.10
        );

        tone(
            659.25,
            0.95,
            "sine",
            cinematicGain(0.070),
            1.85
        );

        tone(
            783.99,
            1.05,
            "sine",
            cinematicGain(0.065),
            2.75
        );

        tone(
            1046.50,
            1.30,
            "sine",
            cinematicGain(0.055),
            3.55
        );

        tone(
            783.99,
            1.60,
            "triangle",
            cinematicGain(0.045),
            3.72
        );

        tone(
            523.25,
            2.10,
            "sine",
            cinematicGain(0.035),
            4.05
        );
    }


    function memorySaved() {

        tone(740, 0.09, "sine", 0.065);
        tone(988, 0.14, "sine", 0.075, 0.10);
        tone(1318, 0.22, "sine", 0.055, 0.23);
    }


    /* -------------------------------------------------
       COMPLETED-LINE EVENT DISPATCH
       ------------------------------------------------- */

    function once(key, fn) {

        if (played[key]) {
            return;
        }

        played[key] = true;

        fn();
    }


    function dispatch(text) {

        if (!text) {
            return;
        }

        var normalized =
            text.trim().toUpperCase();

        if (!normalized) {
            return;
        }

        if (
            normalized.indexOf(
                "> CONNECTION ESTABLISHED."
            ) !== -1
        ) {
            once("connection", confirm);
            return;
        }

        if (
            normalized.indexOf(
                "> ENCRYPTED CHANNEL: ACTIVE"
            ) !== -1
        ) {
            once("encrypted", secure);
            return;
        }

        if (
            normalized === "> WARNING"
        ) {
            once("warning", warning);
            return;
        }

        if (
            normalized.indexOf(
                "> RESPONSE ACCEPTED."
            ) !== -1
        ) {
            once(
                "accepted-" + normalized,
                accessGranted
            );
            return;
        }

        if (
            normalized.indexOf(
                "> RESPONSE REJECTED."
            ) !== -1
        ) {
            once(
                "rejected-" + normalized,
                error
            );
            return;
        }

        if (
            normalized.indexOf(
                "> PASSCODE DECRYPTED."
            ) !== -1
        ) {
            once("decrypted", decrypt);
            return;
        }

        if (
            normalized.indexOf(
                "> PASSCODE COPIED TO CLIPBOARD."
            ) !== -1
        ) {
            once("copied", copied);
            return;
        }

        if (
            normalized.indexOf(
                "> TRANSMISSION COMPLETE."
            ) !== -1
        ) {
            once("transmission", confirm);
            return;
        }

        if (
            normalized.indexOf(
                "> SECURE PACKAGE: DELIVERED."
            ) !== -1
        ) {
            once("package", packageComplete);
            return;
        }

        if (
            normalized.indexOf(
                "> INTELLIGENCE RECORD: VERIFIED."
            ) !== -1
        ) {
            once("record", secure);
            return;
        }

        if (
            normalized.indexOf(
                "> TERMINAL SELF-DESTRUCT INITIATED."
            ) !== -1
        ) {
            once("self-destruct", selfDestructStart);
            return;
        }

        if (
            normalized.indexOf(
                "> SELF-DESTRUCT IN T-"
            ) !== -1
        ) {

            var match =
                normalized.match(
                    /T-(\d+)/
                );

            if (match) {

                once(
                    "countdown-" + match[1],
                    function () {
                        countdown(
                            Number(match[1])
                        );
                    }
                );
            }

            return;
        }

        if (
            normalized.indexOf(
                "> PURGE COMPLETE."
            ) !== -1
        ) {
            once("purge", purge);
            return;
        }
    }


    /*
     * Only dispatch semantic sounds after the element's
     * typing cursor disappears. This prevents sounds from
     * firing halfway through a sentence.
     */

    function observeCompletedText() {

        var observer =
            new MutationObserver(
                function (mutations) {

                    mutations.forEach(
                        function (mutation) {

                            var element =
                                mutation.target;

                            if (
                                element &&
                                element.nodeType === 3
                            ) {
                                element =
                                    element.parentElement;
                            }

                            if (!element) {
                                return;
                            }

                            if (
                                element.nodeType !== 1
                            ) {
                                return;
                            }

                            if (
                                !element.classList
                            ) {
                                return;
                            }

                            /*
                             * The project removes typing-cursor
                             * when the line has finished.
                             */
                            if (
                                mutation.type ===
                                "attributes" &&
                                mutation.attributeName ===
                                "class"
                            ) {

                                if (
                                    !element.classList.contains(
                                        "typing-cursor"
                                    )
                                ) {

                                    dispatch(
                                        element.textContent
                                    );
                                }

                                return;
                            }

                            /*
                             * Fallback for lines created already
                             * complete without a cursor.
                             */
                            if (
                                mutation.type ===
                                "childList" &&
                                element.classList.contains(
                                    "line"
                                ) &&
                                !element.classList.contains(
                                    "typing-cursor"
                                )
                            ) {

                                dispatch(
                                    element.textContent
                                );
                            }

                        }
                    );

                }
            );

        observer.observe(
            document.body,
            {
                subtree: true,
                childList: true,
                characterData: true,
                attributes: true,
                attributeFilter: ["class"]
            }
        );
    }


    /*
     * Detect final birthday reveal.
     * The sound begins once the birthday screen actually
     * becomes active, not when the terminal starts hiding.
     */

    function observeBirthdayReveal() {

        var birthday =
            document.getElementById(
                "birthday-reveal"
            );

        if (!birthday) {
            return;
        }

        var observer =
            new MutationObserver(
                function () {

                    var active =
                        birthday.classList.contains(
                            "birthday-active"
                        ) ||
                        birthday.getAttribute(
                            "aria-hidden"
                        ) === "false";

                    if (active) {
                        once(
                            "birthday-reveal",
                            function () {
                                setTimeout(
                                    birthdayReveal,
                                    1600
                                );
                            }
                        );
                    }
                }
            );

        observer.observe(
            birthday,
            {
                attributes: true,
                attributeFilter: [
                    "class",
                    "aria-hidden"
                ]
            }
        );
    }


    /*
     * Buttons.
     */

    function observeButtons() {

        document.addEventListener(
            "click",
            function (event) {

                var button =
                    event.target.closest(
                        "button"
                    );

                if (!button) {
                    return;
                }

                unlock();

                if (
                    button.id ===
                    "share-memory"
                ) {
                    memorySaved();
                }

                if (
                    button.id ===
                    "download-memory"
                ) {
                    memorySaved();
                }

            }
        );
    }


    window.RINAudio = {

        unlock: unlock,
        typing: typingClick,
        confirm: confirm,
        secure: secure,
        error: error,
        warning: warning,
        accessGranted: accessGranted,
        decryption: decrypt,
        copied: copied,
        packageComplete: packageComplete,
        selfDestruct: selfDestructStart,
        countdown: countdown,
        purge: purge,
        birthday: birthdayReveal,
        memorySaved: memorySaved
    };


    function init() {

        observeCompletedText();
        observeBirthdayReveal();
        observeButtons();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }

})();
