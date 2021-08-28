/*  Wizard */
jQuery(function ($) {
    "use strict";
    // Chose here which method to send the email, available:
    // Simple phpmail text/plain > form_send_single_branch.php (default)
    // PHPMailer text/html > phpmailer/single_branch_phpmailer.php
    // PHPMailer text/html SMTP > phpmailer/single_branch_phpmailer_smtp.php
    // PHPMailer with html template > phpmailer/single_branch_phpmailer_template.php
    // PHPMailer with html template SMTP> phpmailer/single_branch_phpmailer_template_smtp.php

    $(document).ready(() => {
        $("#wizard_container").wizard({
            animations: {
                show: {
                    options: {
                        duration: 800
                    },
                    properties: {
                        opacity: "show"
                    }
                },
                hide: {
                    options: {
                        duration: 0
                    },
                    properties: {
                        opacity: "hide"
                    }
                }
            },
            submit: ".submit",
            beforeSelect: function (event, state) {
                if ($('input#website').val().length != 0) {
                    return false;
                }
                if (!state.isMovingForward)
                    return true;
                var inputs = $(this).wizard('state').step.find(':input');
                var form = $("form#info-token-minting");
                form.valid();
                return !inputs.length || !!inputs.valid();
            }
        }).validate({

            errorPlacement: function (error, element) {
                if (element.is(':radio') || element.is(':checkbox')) {
                    error.insertBefore(element.next());
                } else {
                    error.insertAfter(element);
                }
            },
            debug:true,
        });
        $.validator.addMethod("alphanumericextended", function(value, element) {
            return this.optional(element) || /^[\w\$\£\€\s]+$/i.test(value);
        }, "Letters, numbers, and underscores only please");
        $.validator.addMethod("alphanumeric", function(value, element) {
            return this.optional(element) || /^[^_\W]+$/i.test(value);
        }, "Letters, numbers only please");

        $.fn.filepond.registerPlugin(FilePondPluginImagePreview);
        $.fn.filepond.registerPlugin(FilePondPluginFileValidateSize);
        $.fn.filepond.registerPlugin(FilePondPluginFileValidateType);


        // Turn input element into a pond
        window.FILEPOND = $('.my-pond').filepond({
            acceptedFileTypes: ['image/*', 'video/*', 'audio/*'],
            maxFileSize: "15MB"
        });

        window.FILEPOND2 = $('.my-pond-logo').filepond({
            acceptedFileTypes: ['image/png'],
            maxFileSize: "2MB"
        });


    });

});

$(document).ready(() => {
    $("#wizard_container").wizard({
        transitions: {
            branchtype: function ($step, action) {
                var branch = $step.find(":checked").val();
                if (!branch) {
                    $("form").valid();
                }
                return branch;
            }
        }
    });

});

