(function ($) {

	"use strict";
	$(window).on('load', function () {
		$('[data-loader="circle-side"]').fadeOut(); // will first fade out the loading animation
		$('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
		$('body').delay(350);
		$(window).scroll();
		const clip = 	new ClipboardJS('.btn-clip');
		clip.on('success', function(e) {
			alertify.success('Payment address copied to clipboard');

		});
	});

	$(document).ready(() => {
		$('[data-toggle="tooltip"]').tooltip();
		/* Check and radio input styles */
		$('input.icheck').iCheck({
			checkboxClass: 'icheckbox_square-grey',
			radioClass: 'iradio_square-grey'
		});

		/* Scroll to top small screens: change the top position offset based on your content*/
		var $Scrolbt = $('button.backward,button.forward');
		var $Element = $('html, body');
		var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
		$.post({
			type: "POST",
			url: "/get-initial-data",
			headers: {
				"CSRF-Token": token,
			},
		}).done((result) => {
			$("#number-minted-website").text(result.tokenMinted);
		}); 

		if (window.innerWidth < 800) {
			$Scrolbt.on("click", function () {
				$Element.animate({
					scrollTop: 100
				}, "slow");
				return false;
			});
		}

		/* Form submit loader */
		$('form').on('submit',function() {
			var form = $("form#info-token-minting");
			var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
			form.validate();
			var typeForm = $('input[name="branch_group_1"]:checked').val();
			let url = "/submit-nft-creation";

			if (form.valid()) {
				if(typeForm === "nft"){
					const d = new FormData(this);
					const file_value = $('.my-pond').filepond('getFile');
					d.append("nft_file", file_value.file);
					$("#loader_form").fadeIn();
					$.post({
						type: "POST",
						url: "/submit-nft-creation",
						data: d,
						cache: false,
						contentType: false,
						processData: false,
						headers: {
							"CSRF-Token": token,
						}
					})
						.done(ANSLUME.onSuccessSubmit)
						.fail((error) => {
							$(".status-information .main-content-loader")
								.html(`A problem happened during the submission please try again or contact us via email <strong> ${ANSLUME.contactEmail}</strong>.`);
							console.log(error);
						})
						.always(() => {

						});
				}else{

					const d = new FormData(this);
					const file_value = $('.my-pond-logo').filepond('getFile');
					if(file_value !== null){
						d.append("logo_file", file_value.file);
					}

					$("#loader_form").fadeIn();
					$.post({
						type: "POST",
						url: "/submit-token-creation",
						data: d,
						cache: false,
						contentType: false,
						processData: false,
						headers: {
							"CSRF-Token": token,
						}
					})
						.done(ANSLUME.onSuccessSubmit)
						.fail((error) => {
							$(".status-information .main-content-loader")
								.html(`A problem happened during the submission please try again or contact us via email <strong> ${ANSLUME.contactEmail}</strong>.`);
							console.log(error);
						})
						.always(() => {

						});
				}

			}
		});

	});



})(window.jQuery);
