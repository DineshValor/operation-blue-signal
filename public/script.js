/* =========================================
           RESISTANCE LOGO HEADER BOOT ANIMATION

           Sequence:
           1. Resistance logo appears
           2. Logo glows / pulses
           3. Header title types in
           4. Main terminal transmission starts
           ========================================= */


/* =========================================
   SECURE VERIFICATION API

   Expected answers and the passcode are NEVER
   stored in this frontend. The Worker validates
   them server-side and returns only the result.
   ========================================= */

var obsSessionToken = null;
var agentAlias = "AGENT";
var agentRealName = "";

async function obsApiVerify(stage, answer) {
    var response;

    try {
        response = await fetch("/api/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store",
            credentials: "same-origin",
            body: JSON.stringify({
                stage: stage,
                answer: typeof answer === "string" ? answer : "",
                token: obsSessionToken || ""
            })
        });
    } catch (error) {
        return {
            success: false,
            networkError: true
        };
    }

    var data = {};

    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (data.token) {
        obsSessionToken = data.token;
    }

    if (data.agentAlias) {
        agentAlias = data.agentAlias;
    }

    if (data.realName) {
        agentRealName = data.realName;
    }

    return {
        success: data.success === true,
        expired: data.expired === true,
        networkError: false,
        passcode: typeof data.passcode === "string" ? data.passcode : null,
        agentAlias: agentAlias,
        realName: agentRealName
    };
}

        var resistanceLogoWrap =
            document.querySelector(
                ".resistance-logo-wrap"
            );

        var headerTitle =
            document.getElementById(
                "header-title"
            );


        function activateResistanceLogo(
            callback
        ) {

            if (!resistanceLogoWrap) {
                if (callback) {
                    callback();
                }

                return;
            }


            resistanceLogoWrap.classList.add(
                "logo-active"
            );


            /*
             * Give the logo time to boot
             * before the title begins typing.
             */

            setTimeout(
                function () {

                    if (callback) {
                        callback();
                    }

                },
                1400
            );
        }


        function typeHeaderTitle(
            text,
            index
        ) {

            if (
                index >=
                text.length
            ) {

                setTimeout(
                    function () {

                        headerTitle.classList.remove(
                            "typing-cursor"
                        );

                        startMainTransmission();

                    },
                    500
                );

                return;
            }


            headerTitle.textContent =
                text.substring(
                    0,
                    index + 1
                );


            setTimeout(
                function () {

                    typeHeaderTitle(
                        text,
                        index + 1
                    );

                },
                55
            );
        }


        function startHeaderAnimation() {

            activateResistanceLogo(
                function () {

                    typeHeaderTitle(
                        "RESISTANCE INTELLIGENCE NETWORK",
                        0
                    );

                }
            );
        }


        /* =========================================
           ELEMENTS
           ========================================= */

        var output =
            document.getElementById(
                "terminal-output"
            );

        var verificationContainer =
            document.getElementById(
                "verification-container"
            );


        /* =========================================
           AUTO-SCROLL

           First five displayed lines:
           NO AUTO-SCROLL.

           After that:
           AUTO-SCROLL ACTIVE.
           ========================================= */

        var autoScrollEnabled = false;

        function autoScroll() {

            if (!autoScrollEnabled) {
                return;
            }

            window.scrollTo({
                top:
                    document.documentElement
                        .scrollHeight,

                behavior: "smooth"
            });
        }


        /* =========================================
           ADD TERMINAL LINE
           ========================================= */

        function addLine(text) {

            var line =
                document.createElement(
                    "div"
                );

            line.className =
                "line fade-in";

            line.textContent =
                text;

            output.appendChild(
                line
            );

            autoScroll();

            return line;
        }


        /* =========================================
           IMPORTANT LINE HIGHLIGHTING

           These lines receive the Resistance-blue
           treatment while keeping ordinary terminal
           output muted.
           ========================================= */

        function applyLineHighlight(
            element,
            text
        ) {

            if (!element) {
                return;
            }


            var importantPhrases = [
                "TRANSMISSION COMPLETE.",
                "MISSION RECORD: RESTORED.",
                "DECRYPTION COMPLETE.",
                "PASSCODE DECRYPTED.",
                "AGENT IDENTITY CONFIRMED.",
                "HAPPY BIRTHDAY, AGENT."
            ];


            var isImportant =
                importantPhrases.some(
                    function (phrase) {

                        return text.indexOf(
                            phrase
                        ) !== -1;

                    }
                );


            if (!isImportant) {
                return;
            }


            element.classList.add(
                "terminal-line-highlight"
            );


            if (
                text.indexOf(
                    "HAPPY BIRTHDAY, AGENT."
                ) !== -1
            ) {

                element.classList.add(
                    "major-highlight"
                );
            }
        }


        /* =========================================
           TYPE TERMINAL LINE

           Every new terminal line is typed
           character-by-character.
           ========================================= */

        function typeLine(text, callback, speed) {

            var line =
                document.createElement(
                    "div"
                );

            line.className =
                "line fade-in typing-cursor";

            applyLineHighlight(
                line,
                text
            );

            output.appendChild(
                line
            );

            var characterIndex = 0;

            var typingSpeed =
                speed || 28;


            function typeCharacter() {

                if (
                    characterIndex <
                    text.length
                ) {

                    line.textContent =
                        text.substring(
                            0,
                            characterIndex + 1
                        );

                    characterIndex++;

                    autoScroll();

                    setTimeout(
                        typeCharacter,
                        typingSpeed
                    );

                    return;
                }


                /*
                 * Remove blinking cursor once
                 * the complete line is typed.
                 */

                line.classList.remove(
                    "typing-cursor"
                );


                if (callback) {
                    callback();
                }
            }


            typeCharacter();

            return line;
        }


        /* =========================================
           TYPE MULTIPLE TERMINAL LINES
           ========================================= */

        function typeLines(lines, index, callback) {

            if (index >= lines.length) {

                if (callback) {
                    callback();
                }

                return;
            }


            var currentLine =
                lines[index];


            /*
             * Empty lines are inserted normally
             * but still participate in the sequence.
             */

            if (currentLine === "") {

                addLine("");

                setTimeout(
                    function () {

                        typeLines(
                            lines,
                            index + 1,
                            callback
                        );

                    },
                    300
                );

                return;
            }


            typeLine(
                currentLine,

                function () {

                    setTimeout(
                        function () {

                            typeLines(
                                lines,
                                index + 1,
                                callback
                            );

                        },
                        280
                    );

                },

                25
            );
        }



        /* =========================================
           FIRST FIVE LINES
           ========================================= */

        var firstLines = [

            "> INITIALIZING...",

            "",

            "> CONNECTING TO RESISTANCE NETWORK...",

            "",

            "> CONNECTION ESTABLISHED."

        ];

        var firstLineIndex = 0;


        function showFirstLines() {

            if (
                firstLineIndex >=
                firstLines.length
            ) {

                autoScrollEnabled = true;

                startSecureChannel();

                return;
            }


            var currentLine =
                firstLines[
                    firstLineIndex
                ];


            firstLineIndex++;


            if (currentLine === "") {

                addLine("");

                setTimeout(
                    showFirstLines,
                    350
                );

                return;
            }


            typeLine(
                currentLine,

                function () {

                    setTimeout(
                        showFirstLines,
                        280
                    );

                },

                28
            );
        }



        /* =========================================
           SECURING CHANNEL

           ONE progress line.
           0% -> 100% is replaced
           on the same DOM element.
           ========================================= */

        function startSecureChannel() {

            var title =
                document.createElement(
                    "div"
                );

            title.className =
                "line fade-in";

            title.textContent =
                "> SECURING CHANNEL...";

            output.appendChild(
                title
            );

            autoScroll();


            var progressLine =
                document.createElement(
                    "div"
                );

            progressLine.className =
                "line secure-progress";

            output.appendChild(
                progressLine
            );


            var progress = 0;


            function updateProgress() {

                var totalBlocks = 20;

                var filled =
                    Math.floor(
                        progress /
                        100 *
                        totalBlocks
                    );

                var empty =
                    totalBlocks -
                    filled;

                var bar =
                    "█".repeat(filled) +
                    "░".repeat(empty);


                progressLine.textContent =
                    "> [" +
                    bar +
                    "] " +
                    progress +
                    "%";


                autoScroll();


                if (progress >= 100) {

                    setTimeout(
                        showAfterSecure,
                        600
                    );

                    return;
                }


                progress += 5;


                setTimeout(
                    updateProgress,
                    100
                );
            }


            updateProgress();
        }


        /* =========================================
           AFTER SECURE CHANNEL
           ========================================= */

        var afterSecureLines = [

            "> ENCRYPTED CHANNEL: ACTIVE",

            "",

            "> INCOMING TRANSMISSION DETECTED.",

            "",

            "> SOURCE: UNKNOWN",

            "> CLASSIFICATION: RESTRICTED",

            "> PRIORITY: HIGH",

            "",

            "> DECRYPTING...",

            "",

            "> WARNING",

            "",

            "> THIS TRANSMISSION WAS NOT INTENDED",

            "> FOR GENERAL ACCESS.",

            "",

            "> HOWEVER...",

            "",

            "> CLEARANCE VERIFICATION IS REQUIRED.",

            "",

            "> AUTHENTICATION PROTOCOL INITIATED.",

            "",

            "> AGENT VERIFICATION REQUIRED.",

            "",



        ];

        var afterSecureIndex = 0;


        function showAfterSecure() {

            /*
             * Type every remaining terminal line
             * sequentially.
             */

            typeLines(
                afterSecureLines,
                0,

                function () {

                    showQuestionOne();

                }
            );
        }



        /* =========================================
           TYPE TEXT INSIDE AN EXISTING ELEMENT
           ========================================= */

        function typeElementText(
            element,
            text,
            speed,
            callback
        ) {

            applyLineHighlight(
                element,
                text
            );

            var index = 0;

            element.classList.add(
                "typing-cursor"
            );


            function typeCharacter() {

                if (
                    index <
                    text.length
                ) {

                    element.textContent =
                        text.substring(
                            0,
                            index + 1
                        );

                    index++;

                    autoScroll();

                    setTimeout(
                        typeCharacter,
                        speed || 25
                    );

                    return;
                }


                element.classList.remove(
                    "typing-cursor"
                );


                if (callback) {
                    callback();
                }
            }


            typeCharacter();
        }


        /* =========================================
           QUESTION 01
           ========================================= */

        function showQuestionOne() {

            var section =
                document.createElement(
                    "section"
                );

            section.className =
                "verification fade-in";


            section.innerHTML =

                '<div class="security-title"></div>' +

                '<div class="question">' +
                    'Enter the codename of the Agent who is associated ' +
                    'with this mission?' +
                '</div>' +

                '<label ' +
                    'class="input-label" ' +
                    'for="answer-input">' +
                    'ENTER RESPONSE' +
                '</label>' +

                '<input ' +
                    'id="answer-input" ' +
                    'class="answer-input" ' +
                    'type="text" ' +
                    'autocomplete="off" ' +
                    'autocapitalize="none" ' +
                    'spellcheck="false">' +

                '<button ' +
                    'id="verify-button" ' +
                    'class="verify-button" ' +
                    'type="button">' +
                    'VERIFY' +
                '</button>' +

                '<div ' +
                    'id="feedback" ' +
                    'class="feedback" ' +
                    'aria-live="polite">' +
                '</div>';


            verificationContainer.appendChild(
                section
            );


            /*
             * Animate the question itself like a
             * terminal transmission.
             *
             * The controls stay hidden until the
             * question text has finished typing.
             */

            var securityTitle =
                section.querySelector(
                    ".security-title"
                );

            var questionText =
                section.querySelector(
                    ".question"
                );

            var inputLabel =
                section.querySelector(
                    ".input-label"
                );

            var inputElement =
                section.querySelector(
                    ".answer-input"
                );

            var verifyElement =
                section.querySelector(
                    ".verify-button"
                );

            var feedbackElement =
                section.querySelector(
                    ".feedback"
                );


            securityTitle.style.visibility =
                "hidden";

            questionText.style.visibility =
                "hidden";

            inputLabel.style.visibility =
                "hidden";

            inputElement.style.visibility =
                "hidden";

            verifyElement.style.visibility =
                "hidden";

            feedbackElement.style.visibility =
                "hidden";


            function showQuestionTyping() {

                securityTitle.style.visibility =
                    "visible";

                securityTitle.textContent =
                    "";

                typeElementText(
                    securityTitle,
                    "",
                    25,

                    function () {

                        questionText.style.visibility =
                            "visible";

                        typeElementText(
                            questionText,
                            "Enter the codename of the Agent who is associated with this mission?",
                            22,

                            function () {

                                inputLabel.style.visibility =
                                    "visible";

                                typeElementText(
                                    inputLabel,
                                    "ENTER RESPONSE",
                                    25,

                                    function () {

                                        inputElement.style.visibility =
                                            "visible";

                                        verifyElement.style.visibility =
                                            "visible";

                                        feedbackElement.style.visibility =
                                            "visible";

                                        autoScroll();

                                        setTimeout(
                                            function () {
                                                inputElement.focus();
                                            },
                                            250
                                        );

                                    }
                                );

                            }
                        );

                    }
                );
            }


            showQuestionTyping();


            var input =
                document.getElementById(
                    "answer-input"
                );

            var button =
                document.getElementById(
                    "verify-button"
                );

            var feedback =
                document.getElementById(
                    "feedback"
                );


            setTimeout(
                function () {
                    input.focus();
                },
                400
            );


            /* =====================================
               VERIFY ANSWER
               ===================================== */

            function verifyAnswer() {

                var submitted = input.value.trim().toLowerCase();

                button.disabled = true;
                input.disabled = true;
                feedback.className = "feedback success";
                feedback.innerHTML = "";

                function animateFeedbackLines(lines, index, finished) {
                    if (index >= lines.length) {
                        if (finished) finished();
                        return;
                    }

                    var line = document.createElement("div");
                    line.className = "terminal-line typing-cursor";
                    feedback.appendChild(line);

                    typeElementText(line, lines[index], 28, function () {
                        setTimeout(function () {
                            animateFeedbackLines(lines, index + 1, finished);
                        }, 280);
                    });

                    autoScroll();
                }

                var responseLines = [
                    "> VERIFYING RESPONSE..."
                ];

                animateFeedbackLines(responseLines, 0, async function () {
                    var result = await obsApiVerify(1, submitted);

                    feedback.innerHTML = "";

                    if (result.success) {
                        feedback.className = "feedback success";

                        animateFeedbackLines([
                            "> RESPONSE ACCEPTED.",
                            "> IDENTITY VERIFICATION: CONFIRMED.",
                            "> SECURITY LAYER 01: CLEARED."
                        ], 0, function () {
                            setTimeout(revealAgent, 700);
                        });
                    } else {
                        feedback.className = "feedback error";

                        var failureLines = result.networkError
                            ? [
                                "> SECURE LINK UNAVAILABLE.",
                                "> VERIFICATION SERVER NOT REACHABLE.",
                                "> PLEASE TRY AGAIN."
                            ]
                            : result.expired
                                ? [
                                    "> AUTHORIZATION WINDOW CLOSED.",
                                    "> MISSION TERMINATED."
                                ]
                                : [
                                    "> RESPONSE REJECTED.",
                                    "> IDENTITY VERIFICATION: FAILED.",
                                    "> ACCESS TO NEXT SECURITY LAYER: DENIED.",
                                    "> PLEASE TRY AGAIN."
                                ];

                        animateFeedbackLines(failureLines, 0, function () {
                            input.disabled = false;
                            button.disabled = false;
                            input.value = "";
                            setTimeout(function () { input.focus(); }, 150);
                        });
                    }
                });
            }


            /* =====================================
               VERIFY BUTTON
               ===================================== */

            button.addEventListener(
                "click",
                verifyAnswer
            );


            /* =====================================
               ENTER KEY
               ===================================== */

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        verifyAnswer();
                    }
                }
            );
        }



/* =========================================
   IMAGE LOAD + PAUSE CONTROL
   ========================================= */

function waitForImageLoaded(
    image,
    loadingText,
    loadedText,
    pauseAfterLoad,
    finished
) {

    if (!image) {
        if (finished) {
            finished();
        }
        return;
    }

    var waitLine =
        document.createElement("div");

    waitLine.className =
        "terminal-line image-status typing-cursor";

    var parent =
        image.parentElement;

    if (parent) {
        parent.insertBefore(
            waitLine,
            image
        );
    }

    typeElementText(
        waitLine,
        loadingText,
        28,
        function () {

            function imageReady() {

                image.removeEventListener(
                    "load",
                    imageReady
                );

                image.style.visibility =
                    "visible";

                image.style.opacity =
                    "0";

                image.style.transition =
                    "opacity 0.7s ease";

                typeElementText(
                    waitLine,
                    loadedText,
                    28,
                    function () {

                        image.style.opacity =
                            "1";

                        autoScroll();

                        setTimeout(
                            function () {

                                if (finished) {
                                    finished();
                                }

                            },
                            pauseAfterLoad
                        );

                    }
                );
            }

            if (image.complete &&
                image.naturalWidth > 0) {

                imageReady();

            } else {

                image.addEventListener(
                    "load",
                    imageReady,
                    { once: true }
                );
            }
        }
    );
}


        /* =========================================
           AGENT REVEAL

           IMPORTANT:
           Agent name is not present in the
           opening transmission. It is inserted
           only after Q1 is verified.
           ========================================= */

        function revealAgent() {

            var reveal =
                document.createElement(
                    "section"
                );

            reveal.className =
                "agent-reveal fade-in";


            reveal.innerHTML =

                '<div class="security-title"></div>' +

                '<div class="agent-name"></div>' +

                '<div class="agent-profile">' +

                    '<img ' +
                        'id="agent-profile-image" ' +
                        'src="assets/agent-profile.png" ' +
                        'alt="Recovered Agent profile">' +

                    '<div ' +
                        'class="profile-placeholder" ' +
                        'id="profile-placeholder">' +
                        '&gt; AGENT PROFILE IMAGE PENDING.' +
                    '</div>' +

                '</div>' +

                '<div class="agent-status success">' +

                    '<div class="terminal-line agent-line-1"></div>' +

                    '<div class="terminal-line agent-line-2"></div>' +

                '</div>';


            verificationContainer.appendChild(
                reveal
            );


            var title =
                reveal.querySelector(
                    ".security-title"
                );

            var name =
                reveal.querySelector(
                    ".agent-name"
                );

            var line1 =
                reveal.querySelector(
                    ".agent-line-1"
                );

            var line2 =
                reveal.querySelector(
                    ".agent-line-2"
                );

            var profileImage =
                reveal.querySelector(
                    "#agent-profile-image"
                );

            var profilePlaceholder =
                reveal.querySelector(
                    "#profile-placeholder"
                );

            profileImage.addEventListener(
                "error",
                function () {

                    profileImage.style.display =
                        "none";

                    profilePlaceholder.style.display =
                        "block";

                }
            );


            /*
             * Hide everything initially.
             * Each element is revealed by the
             * same typing animation.
             */

            title.style.visibility =
                "hidden";

            name.style.visibility =
                "hidden";

            line1.style.visibility =
                "hidden";

            line2.style.visibility =
                "hidden";


            title.style.visibility =
                "visible";

            typeElementText(
                title,
                "> IDENTITY RECOVERED",
                28,

                function () {

                    name.style.visibility =
                        "visible";

                    typeElementText(
                        name,
                        agentAlias,
                        45,

                        function () {

                            var profile =
                                reveal.querySelector(
                                    ".agent-profile"
                                );

                            var profileImage =
                                reveal.querySelector(
                                    "#agent-profile-image"
                                );

                            profile.style.visibility =
                                "visible";
                            profile.style.opacity =
                                "1";

                            waitForImageLoaded(
                                profileImage,

                                "> RECOVERING AGENT PROFILE IMAGE...",

                                "> AGENT PROFILE IMAGE: 100% LOADED.",

                                3000,

                                function () {

                                    line1.style.visibility =
                                        "visible";

                                    typeElementText(
                                        line1,
                                        "> AGENT IDENTITY CONFIRMED.",
                                        28,

                                        function () {

                                            line2.style.visibility =
                                                "visible";

                                            typeElementText(
                                                line2,
                                                "> FACTION: RESISTANCE",
                                                28,

                                                function () {
                                                    autoScroll();

                                                    setTimeout(
                                                        showQuestionTwo,
                                                        700
                                                    );
                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );


            autoScroll();
        }



        /* =========================================
           QUESTION 02 // MISSION VERIFICATION
           ========================================= */

        function showQuestionTwo() {

            var section =
                document.createElement(
                    "section"
                );

            section.className =
                "verification fade-in";

            section.innerHTML =

                '<div class="security-title"></div>' +

                '<div class="question"></div>' +

                '<div class="question-hint"></div>' +

                '<label class="input-label" for="answer-input-2">' +
                    'ENTER RESPONSE' +
                '</label>' +

                '<input ' +
                    'id="answer-input-2" ' +
                    'class="answer-input" ' +
                    'type="text" ' +
                    'inputmode="numeric" ' +
                    'autocomplete="off" ' +
                    'autocapitalize="none" ' +
                    'spellcheck="false">' +

                '<button ' +
                    'id="verify-button-2" ' +
                    'class="verify-button" ' +
                    'type="button">' +
                    'VERIFY' +
                '</button>' +

                '<div ' +
                    'class="feedback" ' +
                    'id="feedback-2" ' +
                    'aria-live="polite">' +
                '</div>';

            verificationContainer.appendChild(
                section
            );

            var securityTitle =
                section.querySelector(
                    ".security-title"
                );

            var questionText =
                section.querySelector(
                    ".question"
                );

            var hintText =
                section.querySelector(
                    ".question-hint"
                );

            var input =
                section.querySelector(
                    "#answer-input-2"
                );

            var button =
                section.querySelector(
                    "#verify-button-2"
                );

            var feedback =
                section.querySelector(
                    "#feedback-2"
                );

            securityTitle.style.visibility =
                "hidden";

            questionText.style.visibility =
                "hidden";

            hintText.style.visibility =
                "hidden";

            input.style.visibility =
                "hidden";

            button.style.visibility =
                "hidden";

            feedback.style.visibility =
                "hidden";

            function typeQuestionTwo() {

                securityTitle.style.visibility =
                    "visible";

                typeElementText(
                    securityTitle,
                    "",
                    25,

                    function () {

                        questionText.style.visibility =
                            "visible";

                        typeElementText(
                            questionText,
                            "When did your last RES mission take place with Agents — D1neshVal0r, Jslsingh321 & Orochimaru094?",
                            22,

                            function () {

                                hintText.style.visibility =
                                    "visible";

                                typeElementText(
                                    hintText,
                                    "Hint: MMYYYY",
                                    25,

                                    function () {

                                        var label =
                                            section.querySelector(
                                                ".input-label"
                                            );

                                        label.style.visibility =
                                            "visible";

                                        typeElementText(
                                            label,
                                            "ENTER RESPONSE",
                                            25,

                                            function () {

                                                input.style.visibility =
                                                    "visible";

                                                button.style.visibility =
                                                    "visible";

                                                feedback.style.visibility =
                                                    "visible";

                                                autoScroll();

                                                setTimeout(
                                                    function () {
                                                        input.focus();
                                                    },
                                                    250
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }

            typeQuestionTwo();

            function showResponse(lines, success) {

                feedback.innerHTML = "";

                feedback.className =
                    success
                        ? "feedback success"
                        : "feedback error";

                function next(index) {

                    if (index >= lines.length) {

                        if (success) {
                            setTimeout(
                                showQuestionThree,
                                700
                            );
                        } else {
                            input.disabled = false;
                            button.disabled = false;
                            input.value = "";

                            setTimeout(
                                function () {
                                    input.focus();
                                },
                                150
                            );
                        }

                        return;
                    }

                    var line =
                        document.createElement(
                            "div"
                        );

                    line.className =
                        "terminal-line typing-cursor";

                    feedback.appendChild(
                        line
                    );

                    typeElementText(
                        line,
                        lines[index],
                        28,

                        function () {
                            setTimeout(
                                function () {
                                    next(index + 1);
                                },
                                280
                            );
                        }
                    );

                    autoScroll();
                }

                next(0);
            }

            function verifyQuestionTwo() {

                var submitted = input.value.trim();

                button.disabled = true;
                input.disabled = true;

                if (!obsSessionToken) {
                    showResponse([
                        "> SESSION NOT FOUND.",
                        "> AUTHORIZATION RESTART REQUIRED."
                    ], false);
                    return;
                }

                /* Verify Q2 on the Worker. The expected answer never
                   appears in this JavaScript. */
                obsApiVerify(2, submitted).then(function (result) {
                    if (result.success) {
                        showResponse([
                            "> VERIFYING RESPONSE...",
                            "> RESPONSE ACCEPTED.",
                            "> MISSION VERIFICATION: CONFIRMED.",
                            "> SECURITY LAYER 02: CLEARED."
                        ], true);
                    } else if (result.networkError) {
                        showResponse([
                            "> SECURE LINK UNAVAILABLE.",
                            "> VERIFICATION SERVER NOT REACHABLE.",
                            "> PLEASE TRY AGAIN."
                        ], false);
                    } else if (result.expired) {
                        showResponse([
                            "> PASSCODE EXPIRED.",
                            "> AUTHORIZATION WINDOW CLOSED.",
                            "> MISSION TERMINATED."
                        ], false);
                    } else {
                        showResponse([
                            "> VERIFYING RESPONSE...",
                            "> RESPONSE REJECTED.",
                            "> MISSION VERIFICATION: FAILED.",
                            "> ACCESS TO NEXT SECURITY LAYER: DENIED.",
                            "> PLEASE TRY AGAIN."
                        ], false);
                    }
                });
            }

            button.addEventListener(
                "click",
                verifyQuestionTwo
            );

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {
                        verifyQuestionTwo();
                    }
                }
            );

            autoScroll();
        }


        /* =========================================
           QUESTION 03
           ========================================= */

        function showQuestionThree() {

            var section =
                document.createElement(
                    "section"
                );

            section.className =
                "verification fade-in";

            section.innerHTML =
                '<div class="security-title"></div>' +
                '<div class="question"></div>' +
                '<label class="input-label" for="answer-input-3">' +
                    'ENTER RESPONSE' +
                '</label>' +
                '<input ' +
                    'id="answer-input-3" ' +
                    'class="answer-input" ' +
                    'type="text" ' +
                    'autocomplete="off" ' +
                    'autocapitalize="none" ' +
                    'spellcheck="false">' +
                '<button ' +
                    'id="verify-button-3" ' +
                    'class="verify-button" ' +
                    'type="button">' +
                    'VERIFY' +
                '</button>' +
                '<div class="feedback" id="feedback-3" aria-live="polite"></div>';

            verificationContainer.appendChild(section);

            var securityTitle = section.querySelector(".security-title");
            var questionText = section.querySelector(".question");
            var inputLabel = section.querySelector(".input-label");
            var input = section.querySelector("#answer-input-3");
            var button = section.querySelector("#verify-button-3");
            var feedback = section.querySelector("#feedback-3");

            securityTitle.style.visibility = "hidden";
            questionText.style.visibility = "hidden";
            inputLabel.style.visibility = "hidden";
            input.style.visibility = "hidden";
            button.style.visibility = "hidden";
            feedback.style.visibility = "hidden";

            function typeQuestionThree() {
                securityTitle.style.visibility = "visible";
                typeElementText(
                    securityTitle,
                    "",
                    25,
                    function () {
                        questionText.style.visibility = "visible";
                        typeElementText(
                            questionText,
                            "Where did your last RES mission take place with Agents — D1neshVal0r?",
                            22,
                            function () {
                                inputLabel.style.visibility = "visible";
                                typeElementText(
                                    inputLabel,
                                    "ENTER RESPONSE",
                                    25,
                                    function () {
                                        input.style.visibility = "visible";
                                        button.style.visibility = "visible";
                                        feedback.style.visibility = "visible";
                                        autoScroll();
                                        setTimeout(function () { input.focus(); }, 250);
                                    }
                                );
                            }
                        );
                    }
                );
            }

            typeQuestionThree();

            function showResponse(lines, success) {
                feedback.innerHTML = "";
                feedback.className = success ? "feedback success" : "feedback error";

                function next(index) {
                    if (index >= lines.length) {
                        if (success) {
                            setTimeout(revealMissionImage, 700);
                        } else {
                            input.disabled = false;
                            button.disabled = false;
                            input.value = "";
                            setTimeout(function () { input.focus(); }, 150);
                        }
                        return;
                    }

                    var line = document.createElement("div");
                    line.className = "terminal-line typing-cursor";
                    feedback.appendChild(line);

                    typeElementText(
                        line,
                        lines[index],
                        28,
                        function () {
                            setTimeout(function () { next(index + 1); }, 280);
                        }
                    );
                    autoScroll();
                }

                next(0);
            }

            function verifyQuestionThree() {
                var submitted = input.value.trim();

                button.disabled = true;
                input.disabled = true;

                if (!obsSessionToken) {
                    showResponse([
                        "> SESSION NOT FOUND.",
                        "> AUTHORIZATION RESTART REQUIRED."
                    ], false);
                    return;
                }

                obsApiVerify(3, submitted).then(function (result) {
                    if (result.success) {
                        showResponse([
                            "> VERIFYING RESPONSE...",
                            "> RESPONSE ACCEPTED.",
                            "> MISSION VERIFICATION: CONFIRMED.",
                            "> SECURITY LAYER 03: CLEARED."
                        ], true);
                    } else if (result.networkError) {
                        showResponse([
                            "> SECURE LINK UNAVAILABLE.",
                            "> VERIFICATION SERVER NOT REACHABLE.",
                            "> PLEASE TRY AGAIN."
                        ], false);
                    } else if (result.expired) {
                        showResponse([
                            "> PASSCODE EXPIRED.",
                            "> AUTHORIZATION WINDOW CLOSED.",
                            "> MISSION TERMINATED."
                        ], false);
                    } else {
                        showResponse([
                            "> VERIFYING RESPONSE...",
                            "> RESPONSE REJECTED.",
                            "> MISSION VERIFICATION: FAILED.",
                            "> ACCESS TO NEXT SECURITY LAYER: DENIED.",
                            "> PLEASE TRY AGAIN."
                        ], false);
                    }
                });
            }

            button.addEventListener("click", verifyQuestionThree);
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") verifyQuestionThree();
            });

            autoScroll();
        }


        /* =========================================
           MISSION 2024 IMAGE REVEAL
           Wait for the real image load event,
           then pause for 3 seconds.
           ========================================= */

        function revealMissionImage() {

            var section =
                document.createElement(
                    "section"
                );

            section.className =
                "agent-reveal mission-reveal fade-in";

            section.innerHTML =

                '<div class="security-title" id="mission-title"></div>' +

                '<div class="mission-status" id="mission-status"></div>' +

                '<div class="mission-image-wrap" id="mission-image-wrap">' +
                    '<img ' +
                        'id="mission-image" ' +
                        'src="assets/mission-2024.jpg" ' +
                        'alt="Mission record from 2024">' +
                '</div>' +

                '<div class="agent-status success" id="mission-complete"></div>';

            verificationContainer.appendChild(
                section
            );

            var title =
                section.querySelector(
                    "#mission-title"
                );

            var status =
                section.querySelector(
                    "#mission-status"
                );

            var image =
                section.querySelector(
                    "#mission-image"
                );

            var imageWrap =
                section.querySelector(
                    "#mission-image-wrap"
                );

            var complete =
                section.querySelector(
                    "#mission-complete"
                );

            imageWrap.style.visibility =
                "hidden";

            imageWrap.style.opacity =
                "0";

            complete.style.visibility =
                "hidden";

            typeElementText(
                title,
                "> MISSION INTEL RECOVERED",
                28,

                function () {

                    typeElementText(
                        status,
                        "> RECOVERING MISSION IMAGE...",
                        28,

                        function () {

                            function imageLoaded() {

                                image.onload =
                                    null;

                                image.onerror =
                                    null;

                                typeElementText(
                                    status,
                                    "> MISSION IMAGE: 100% LOADED.",
                                    28,

                                    function () {

                                        imageWrap.style.visibility =
                                            "visible";

                                        imageWrap.style.opacity =
                                            "1";

                                        autoScroll();

                                        setTimeout(
                                            function () {

                                                complete.style.visibility =
                                                    "visible";

                                                typeElementText(
                                                    complete,
                                                    "> MISSION RECORD: RESTORED.",
                                                    28,

                                                    function () {

                                                        autoScroll();

                                                        setTimeout(
                                                            showFinalIntel,
                                                            700
                                                        );

                                                    }
                                                );

                                            },
                                            3000
                                        );
                                    }
                                );
                            }

                            image.onload =
                                imageLoaded;

                            image.onerror =
                                function () {

                                    image.onload =
                                        null;

                                    image.onerror =
                                        null;

                                    typeElementText(
                                        status,
                                        "> MISSION IMAGE: UNAVAILABLE.",
                                        28,

                                        function () {
                                            autoScroll();
                                        }
                                    );
                                };

                            if (
                                image.complete &&
                                image.naturalWidth > 0
                            ) {
                                imageLoaded();
                            }

                        }
                    );
                }
            );

            autoScroll();
        }


        /* =========================================
           FINAL INTEL // CLICK-TO-DECRYPT PASSCODE

           The passcode is NOT present in the frontend.
           The Worker releases it only after the server
           verifies the authenticated session.
           ========================================= */

        function showFinalIntel() {

            var section=document.createElement("section");
            section.className="final-intel fade-in";
            section.innerHTML=
                '<div class="security-title final-title"></div>'+
                '<div class="final-lines">'+
                    '<div class="terminal-line final-line-1"></div>'+ 
                    '<div class="terminal-line final-line-2"></div>'+ 
                    '<div class="terminal-line final-line-3"></div>'+ 
                    '<div class="terminal-line final-line-4"></div>'+ 
                    '<div class="terminal-line final-line-5"></div>'+ 
                '</div>'+ 
                '<div class="final-decryption">'+
                    '<div class="decrypt-progress" id="decrypt-progress"></div>'+
                    '<div class="passcode-expiry-notice" aria-label="Passcode expiry">'+
                        '&gt; PASSCODE AUTHORIZATION WINDOW:<br>'+
                        '&gt; VALID UNTIL: 30 AUGUST 2026.'+
                    '</div>'+
                    '<button type="button" class="decrypt-button" id="decrypt-button">CLICK TO DECRYPT</button>'+ 
                    '<div class="decrypt-status" id="decrypt-status"></div>'+ 
                    '<button type="button" class="passcode-box" id="passcode-box" aria-label="Copy decrypted passcode"><span id="passcode-text">••••••••••••••••</span></button>'+ 
                '</div>'+ 
                '<div class="final-ending" id="final-ending">'+
                    '<div class="terminal-line ending-line-1"></div>'+ 
                    '<div class="terminal-line ending-line-2"></div>'+ 
                    '<div class="terminal-line ending-line-3"></div>'+ 
                    '<div class="terminal-line ending-line-4"></div>'+ 
                    '<div class="terminal-line ending-line-5"></div>'+ 
                '</div>';
            verificationContainer.appendChild(section);

            var title=section.querySelector('.final-title');
            var lines=[1,2,3,4,5].map(function(n){return section.querySelector('.final-line-'+n);});
            var progress=section.querySelector('#decrypt-progress');
            var button=section.querySelector('#decrypt-button');
            var status=section.querySelector('#decrypt-status');
            var box=section.querySelector('#passcode-box');
            var text=section.querySelector('#passcode-text');
            var ending=section.querySelector('#final-ending');
            button.style.visibility='hidden'; box.style.visibility='hidden'; ending.style.visibility='hidden';

            typeElementText(title, '> FINAL INTEL // ENCRYPTED', 28, function(){
                var msgs=[
                    '> MISSION RECORD: RESTORED.',
                    '> ARCHIVE RECORD: 10/2024.',
                    '> PERSONNEL RECORD: VERIFIED.',
                    '> MISSION STATUS: COMPLETE.',
                    '> ENCRYPTED DATA FRAGMENT DETECTED.'
                ];
                function next(i){
                    if(i>=msgs.length){setTimeout(startDecrypt,500);return;}
                    typeElementText(lines[i],msgs[i],28,function(){setTimeout(function(){next(i+1);},280);});
                }
                next(0);
            });

            function startDecrypt(){
                typeElementText(progress,'> DECRYPTING FINAL INTEL...',28,function(){
                    var p=document.createElement('div');
                    p.className='decrypt-progress-line'; progress.appendChild(p);
                    var states=[0,25,50,75,100], i=0;
                    function tick(){
                        var pct=states[i], filled=Math.floor(pct/5), empty=20-filled;
                        p.textContent='> ['+'█'.repeat(filled)+'░'.repeat(empty)+'] '+pct+'%'; autoScroll();
                        if(i===states.length-1){setTimeout(function(){
                            typeElementText(status,'> DECRYPTION COMPLETE.',28,function(){
                                typeElementText(status,'> REDEEMABLE PASSCODE DETECTED.',28,function(){button.style.visibility='visible';autoScroll();});
                            });
                        },700);return;}
                        i++;setTimeout(tick,550);
                    }
                    tick();
                });
            }

            button.addEventListener('click', function () {
                button.disabled = true;
                button.style.display = 'none';

                typeElementText(status, '> AUTHORIZATION REQUESTED...', 28, function () {
                    typeElementText(status, '> SECURE SERVER VALIDATION IN PROGRESS...', 22, function () {
                        obsApiVerify(4, '').then(function (result) {

                            if (result.success && result.passcode) {
                                typeElementText(
                                    status,
                                    '> CLEARANCE ACCEPTED. DECRYPTING PASSCODE...',
                                    22,
                                    function () {
                                        revealPasscode(result.passcode);
                                    }
                                );
                                return;
                            }

                            if (result.expired) {
                                typeElementText(
                                    status,
                                    '> PASSCODE EXPIRED.',
                                    28,
                                    function () {
                                        typeElementText(
                                            status,
                                            '> AUTHORIZATION WINDOW CLOSED.',
                                            28,
                                            function () {
                                                typeElementText(
                                                    status,
                                                    '> MISSION TERMINATED.',
                                                    28
                                                );
                                            }
                                        );
                                    }
                                );
                                return;
                            }

                            typeElementText(
                                status,
                                result.networkError
                                    ? '> SECURE LINK UNAVAILABLE. TRY AGAIN.'
                                    : '> AUTHORIZATION DENIED.',
                                28,
                                function () {
                                    button.style.display = '';
                                    button.disabled = false;
                                }
                            );
                        });
                    });
                });
            });

            function revealPasscode(target) {
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                var revealed = 0;
                box.style.visibility = 'visible';
                box.classList.add('scrambling');

                var timer = setInterval(function () {
                    var value = '';
                    for (var i = 0; i < target.length; i++) {
                        value += i < revealed
                            ? target[i]
                            : chars[Math.floor(Math.random() * chars.length)];
                    }

                    text.textContent = value;
                    autoScroll();
                    revealed++;

                    if (revealed > target.length) {
                        clearInterval(timer);
                        text.textContent = target;
                        box.classList.remove('scrambling');
                        box.classList.add('decrypted');

                        setTimeout(function () {
                            typeElementText(
                                status,
                                '> PASSCODE DECRYPTED. TAP THE CODE TO COPY.',
                                24,
                                showEnding
                            );
                        }, 700);
                    }
                }, 120);
            }

            function showEnding(){
                ending.style.visibility='visible';
                var data=[
                    '> TRANSMISSION COMPLETE.',
                    '',
                    '',
                    '',
                    '> CLICK/TAP ON PASSCODE TO COPY AND CONTINUE FOR ANOTHER SURPRISE.'
                ];
                function next(i){if(i>=data.length){autoScroll();return;} typeElementText(ending.querySelector('.ending-line-'+(i+1)),data[i],26,function(){setTimeout(function(){next(i+1);},280);});}
                next(0);
            }

            box.addEventListener('click', function () {
                var code = text.textContent;

                if (!code || code.indexOf('•') === 0) return;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(code).then(function () {
                        typeElementText(
                            status,
                            '> PASSCODE COPIED TO CLIPBOARD.',
                            24,
                            function () {
                                setTimeout(function () {
                                    initiateSelfDestruct(status);
                                }, 1200);
                            }
                        );
                    }).catch(function () {
                        typeElementText(
                            status,
                            '> COPY FAILED. SELECT THE PASSCODE MANUALLY.',
                            24
                        );
                    });
                } else {
                    typeElementText(
                        status,
                        '> COPY UNAVAILABLE. SELECT THE PASSCODE MANUALLY.',
                        24
                    );
                }
            });

            autoScroll();
        }


        /* =========================================
           FINAL SECURE PACKAGE / SELF-DESTRUCT
           ========================================= */

        function initiateSelfDestruct(status) {

            var terminal =
                document.querySelector(
                    ".terminal"
                );

            var birthday =
                document.getElementById(
                    "birthday-reveal"
                );

            var countdown =
                document.getElementById(
                    "self-destruct-countdown"
                );

            if (!terminal || !birthday) {
                return;
            }

            /*
             * Make sure the final package is
             * visible before beginning purge.
             */

            typeElementText(
                status,
                "> SECURE PACKAGE: DELIVERED.",
                24,
                function () {

                    typeElementText(
                        status,
                        "> INTELLIGENCE RECORD: VERIFIED.",
                        24,
                        function () {

                            typeElementText(
                                status,
                                "> TERMINAL SELF-DESTRUCT INITIATED.",
                                24,
                                function () {

                                    startSelfDestructCountdown(
                                        terminal,
                                        birthday
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }


        function startSelfDestructCountdown(
            terminal,
            birthday
        ) {

            var section =
                document.createElement(
                    "section"
                );

            section.className =
                "self-destruct-sequence";

            section.innerHTML =

                '<div class="self-destruct-label">' +
                    '&gt; SECURE TERMINAL PURGE' +
                '</div>' +

                '<div ' +
                    'class="self-destruct-countdown" ' +
                    'id="self-destruct-countdown">' +
                '</div>';

            verificationContainer.appendChild(
                section
            );

            var counter =
                section.querySelector(
                    "#self-destruct-countdown"
                );

            var seconds =
                5;


            function tick() {

                typeElementText(
                    counter,
                    "> SELF-DESTRUCT IN T-" +
                    seconds +
                    "...",
                    28,
                    function () {

                        if (
                            seconds <= 1
                        ) {

                            setTimeout(
                                function () {

                                    purgeTerminal(
                                        terminal,
                                        section,
                                        birthday
                                    );

                                },
                                700
                            );

                            return;
                        }

                        seconds--;

                        setTimeout(
                            tick,
                            900
                        );

                    }
                );

            }

            tick();

        }


        function purgeTerminal(
            terminal,
            countdownSection,
            birthday
        ) {

            typeElementText(
                countdownSection,
                "> PURGE COMPLETE. TRANSMISSION TERMINATED.",
                24,
                function () {

                    setTimeout(
                        function () {

                            terminal.classList.add(
                                "terminal-self-destruct"
                            );

                            setTimeout(
                                function () {

                                    terminal.style.display =
                                        "none";

                                    showBirthdayReveal(
                                        birthday
                                    );

                                },
                                1000
                            );

                        },
                        600
                    );

                }
            );

        }


        function showBirthdayReveal(
            birthday
        ) {

            birthday.setAttribute(
                "aria-hidden",
                "false"
            );

            birthday.classList.add(
                "birthday-active"
            );

            document.body.classList.add(
                "birthday-mode"
            );


            var logo =
                birthday.querySelector(
                    ".birthday-logo-wrap"
                );

            var kicker =
                document.getElementById(
                    "birthday-kicker"
                );

            var name =
                document.getElementById(
                    "birthday-name"
                );

            var realName =
                document.getElementById(
                    "birthday-real-name"
                );

            var date =
                document.getElementById(
                    "birthday-date"
                );

            var mission =
                document.getElementById(
                    "birthday-mission"
                );

            var from =
                document.getElementById(
                    "birthday-from"
                );

            var shareMemory =
                document.getElementById(
                    "share-memory"
                );

            var downloadMemory =
                document.getElementById(
                    "download-memory"
                );

            var memoryStatus =
                document.getElementById(
                    "memory-status"
                );


            setTimeout(
                function () {

                    logo.classList.add(
                        "birthday-logo-active"
                    );

                },
                300
            );


            setTimeout(
                function () {

                    typeElementText(
                        kicker,
                        "HAPPY BIRTHDAY, AGENT.",
                        70
                    );

                },
                1100
            );


            setTimeout(
                function () {

                    typeElementText(
                        name,
                        agentAlias,
                        100
                    );

                },
                3000
            );


            setTimeout(
                function () {

                    typeElementText(
                        realName,
                        agentRealName || "Agent",
                        75
                    );

                },
                4700
            );


            setTimeout(
                function () {

                    typeElementText(
                        date,
                        "14th AUGUST",
                        85
                    );

                },
                6200
            );


            setTimeout(
                function () {

                    typeElementText(
                        mission,
                        "OPERATION BLUE SIGNAL // STATUS: COMPLETE",
                        38
                    );

                },
                7900
            );


            setTimeout(
                function () {

                    typeElementText(
                        from,
                        "FROM: D1neshVal0r",
                        45
                    );

                },
                9300
            );


            setTimeout(
                function () {

                    shareMemory.classList.add(
                        "memory-visible"
                    );

                    downloadMemory.classList.add(
                        "memory-visible"
                    );

                    bindMemoryActions();

                },
                10800
            );


            

        }

        /* =========================================
           BIRTHDAY MEMORY CAPTURE
           ========================================= */

        function setMemoryStatus(
            message
        ) {

            var status =
                document.getElementById(
                    "memory-status"
                );

            if (!status) {
                return;
            }

            status.textContent =
                "> " + message;

            status.classList.add(
                "visible"
            );

        }


        function captureBirthdayMemory() {

            var birthday =
                document.getElementById(
                    "birthday-reveal"
                );

            if (
                !birthday ||
                typeof html2canvas ===
                "undefined"
            ) {

                setMemoryStatus(
                    "MEMORY ENGINE UNAVAILABLE."
                );

                return Promise.resolve(
                    null
                );

            }

            var actions =
                birthday.querySelector(
                    ".birthday-actions"
                );

            var status =
                birthday.querySelector(
                    ".memory-status"
                );

            if (actions) {
                actions.style.visibility =
                    "hidden";
            }

            if (status) {
                status.style.visibility =
                    "hidden";
            }

            return html2canvas(
                birthday,
                {
                    backgroundColor:
                        "#02050c",

                    scale:
                        Math.min(
                            window.devicePixelRatio ||
                            1,
                            2
                        ),

                    useCORS:
                        true,

                    allowTaint:
                        false,

                    logging:
                        false,

                    imageTimeout:
                        10000,

                    width:
                        birthday.clientWidth,

                    height:
                        birthday.clientHeight,

                    windowWidth:
                        birthday.clientWidth,

                    windowHeight:
                        birthday.clientHeight
                }
            )
            .then(
                function (canvas) {

                    if (actions) {
                        actions.style.visibility =
                            "";
                    }

                    if (status) {
                        status.style.visibility =
                            "";
                    }

                    return canvas;

                }
            )
            .catch(
                function (error) {

                    if (actions) {
                        actions.style.visibility =
                            "";
                    }

                    if (status) {
                        status.style.visibility =
                            "";
                    }

                    console.error(
                        "Birthday memory capture failed:",
                        error
                    );

                    setMemoryStatus(
                        "MEMORY CAPTURE FAILED."
                    );

                    return null;

                }
            );

        }


        function downloadMemoryBlob(
            blob
        ) {

            var url =
                URL.createObjectURL(
                    blob
                );

            var link =
                document.createElement(
                    "a"
                );

            link.href =
                url;

            link.download =
                "operation-blue-signal-memory.png";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            setTimeout(
                function () {

                    URL.revokeObjectURL(
                        url
                    );

                },
                1000
            );

        }


        function saveBirthdayMemory() {

            var button =
                document.getElementById(
                    "download-memory"
                );

            if (button) {
                button.disabled =
                    true;
            }

            setMemoryStatus(
                "CAPTURING BIRTHDAY MEMORY..."
            );

            captureBirthdayMemory()
                .then(
                    function (canvas) {

                        if (!canvas) {
                            return;
                        }

                        canvas.toBlob(
                            function (blob) {

                                if (!blob) {

                                    setMemoryStatus(
                                        "IMAGE CREATION FAILED."
                                    );

                                    return;

                                }

                                downloadMemoryBlob(
                                    blob
                                );

                                setMemoryStatus(
                                    "MEMORY IMAGE SAVED."
                                );

                            },
                            "image/png"
                        );

                    }
                )
                .finally(
                    function () {

                        if (button) {
                            button.disabled =
                                false;
                        }

                    }
                );

        }


        function shareBirthdayMemory() {

            var button =
                document.getElementById(
                    "share-memory"
                );

            if (button) {
                button.disabled =
                    true;
            }

            setMemoryStatus(
                "PREPARING SECURE MEMORY..."
            );

            captureBirthdayMemory()
                .then(
                    function (canvas) {

                        if (!canvas) {
                            return;
                        }

                        canvas.toBlob(
                            function (blob) {

                                if (!blob) {

                                    setMemoryStatus(
                                        "IMAGE CREATION FAILED."
                                    );

                                    return;

                                }

                                var file =
                                    new File(
                                        [
                                            blob
                                        ],
                                        "operation-blue-signal-memory.png",
                                        {
                                            type:
                                                "image/png"
                                        }
                                    );

                                if (
                                    navigator.share &&
                                    navigator.canShare &&
                                    navigator.canShare(
                                        {
                                            files:
                                                [
                                                    file
                                                ]
                                        }
                                    )
                                )
                                {

                                    navigator.share(
                                        {
                                            title:
                                                "Operation Blue Signal",

                                            text:
                                                "Happy Birthday, Agent " + agentAlias + ".",

                                            files:
                                                [
                                                    file
                                                ]
                                        }
                                    )
                                    .then(
                                        function () {

                                            setMemoryStatus(
                                                "MEMORY SHARED SUCCESSFULLY."
                                            );

                                        }
                                    )
                                    .catch(
                                        function (
                                            error
                                        ) {

                                            if (
                                                error &&
                                                error.name ===
                                                "AbortError"
                                            ) {

                                                setMemoryStatus(
                                                    "SHARE CANCELLED."
                                                );

                                            }
                                            else {

                                                downloadMemoryBlob(
                                                    blob
                                                );

                                                setMemoryStatus(
                                                    "SHARE UNAVAILABLE. MEMORY IMAGE SAVED."
                                                );

                                            }

                                        }
                                    )
                                    .finally(
                                        function () {

                                            if (button) {
                                                button.disabled =
                                                    false;
                                            }

                                        }
                                    );

                                }
                                else {

                                    downloadMemoryBlob(
                                        blob
                                    );

                                    setMemoryStatus(
                                        "SHARING UNAVAILABLE. MEMORY IMAGE SAVED."
                                    );

                                    if (button) {
                                        button.disabled =
                                            false;
                                    }

                                }

                            },
                            "image/png"
                        );

                    }
                );

        }


        /*
         * Attach the memory actions only after
         * the birthday screen has been created.
         */

        function bindMemoryActions() {

            var share =
                document.getElementById(
                    "share-memory"
                );

            var download =
                document.getElementById(
                    "download-memory"
                );

            if (!share || !download) {
                return;
            }

            share.addEventListener(
                "click",
                shareBirthdayMemory
            );

            download.addEventListener(
                "click",
                saveBirthdayMemory
            );

        }



        /* =========================================
           START
           ========================================= */

        /*
         * Header animation must complete first.
         * The main terminal transmission then begins.
         */

        function startMainTransmission() {

            showFirstLines();

        }


        startHeaderAnimation();
