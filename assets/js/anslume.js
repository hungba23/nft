
(function () {
    window.ANSLUME = {
        onSuccessSubmit:  (res) => {
            const loaderForm = $("#loader_form");
            if(loaderForm.is(":hidden")) loaderForm.fadeIn();

            $("#after-first-step ").fadeIn();
            $("#amount-to-send").text(`${res.amount} ADA`);
            $("#reference-transaction").text(res.ref);
            $("#payment-address").text(ANSLUME.paymentAddr);


            $(".status-information .main-content-loader").html(
                `<span class="current-status">Current status:</span> waiting for the transaction to arrive on the payment address`
            );

            ANSLUME.checkUpdate(res.amount, res.ref, 1);

        },
        checkUpdate: (amount, ref, status) => {

            window.history.pushState('Page', 'Creating your cardano Native Token...', `/order-info/${ref}?amount=${amount}`);
            var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            $.post({
                type: "POST",
                url: "/check-update-transaction",
                data: { amount, ref, status},
                headers: {
                    "CSRF-Token": token,
                },
            }).done(
                (res) => {
                    setTimeout(() => {
                        switch (parseInt(res.status))	{

                            case 1:
                                ANSLUME.updateStatusMessage("waiting for the transaction to arrive on the payment address");
                                return ANSLUME.checkUpdate(amount, ref, 1);
                            case 2:
                                ANSLUME.updateStatusMessage("ADA received, currently minting your token");
                                return ANSLUME.checkUpdate(amount, ref, 2);
                            case 3:
                                ANSLUME.updateStatusMessage("Your token is minted and has been sent back to your wallet.");
                                $("#circle-loader-popup").hide();
                                $("div#after-first-step").hide();
                                $("div#success-minting").fadeIn();
                                $("#link-transac-confirmed").attr("href", `https://cardanoscan.io/transaction/${res.txHash}`);
                                $("#link-transac-confirmed-poolpm").attr("href", `https://pool.pm/${res.policyId}.${res.assetName}`);
                                //Put it in gree
                        }

                    }, 5000);

                }
            ).fail((error) => {
                $(".status-information .main-content-loader")
                    .html(`A problem happened during the submission please try again or contact us via email <strong> ${ANSLUME.contactEmail}</strong>.`);
                console.log(JSON.stringify(error));
                if(error.responseJSON && error.responseJSON.notFind === true){
                    $("#after-first-step").hide();
                }
            });
        },
        updateStatusMessage: (message) => $(".status-information .main-content-loader").html(
            `<span class="current-status">Current status:</span> ${message}`
        ),



    }
})();