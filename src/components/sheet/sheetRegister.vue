<template>
	<f7-sheet class="justify-content-center" id="sheet-register" style="height: auto; --f7-sheet-bg-color: #fff"
		swipe-to-close backdrop @sheet:closed="clearForm()">
		<f7-page-content>
			<f7-block class="padding-top">
				<f7-block-title class="padding-bottom">REGISTER</f7-block-title>
				<f7-list form>
					<f7-list-input class="register-new-field" id="register-firstname" type="text" placeholder="First Name"
						@input="registerFirstName = $event.target.value" :value="registerFirstName"
						required></f7-list-input>
					<f7-list-input class="register-new-field" id="register-lastname" type="text" placeholder="Last Name"
						@input="registerLastName = $event.target.value" :value="registerLastName" required></f7-list-input>
					<f7-list-input class="register-new-field" id="register-email" type="email" placeholder="Email"
						@input="registerEmail = $event.target.value" :value="registerEmail" required></f7-list-input>
					<f7-list-input class="register-new-field" id="register-password" type="password" placeholder="Password"
						@input="registerPassword = $event.target.value" :value="registerPassword" required></f7-list-input>
					<f7-list-input class="register-new-field" id="register-code" type="text" placeholder="Code"
						@input="registerCode = $event.target.value" :value="registerCode" required></f7-list-input>
				</f7-list>
				<div style="padding-left: 25px; padding-right: 25px">
					<f7-button fill round large color="black" type="submit" @click="submit()">
						SUBMIT
					</f7-button>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
	name: "sheet-register",
	data() {
		return {
			registerFirstName: "",
			registerLastName: "",
			registerEmail: "",
			registerPassword: "",
			registerCode: "",
		};
	},
	mixins: [misc, fetch],
	computed: {},
	methods: {
		clearForm() {
			this.registerFirstName = "";
			this.registerLastName = "";
			this.registerEmail = "";
			this.registerPassword = "";
			this.registerCode = "";
		},
		async submit() {
			var isValid = true;

			//FIRST NAME
			var validateFirstName = f7.input.validateInputs(
				"#register-firstname"
			);
			if (validateFirstName == false) {
				isValid = false;
			}

			//LAST NAME
			var validateLastName =
				f7.input.validateInputs("#register-lastname");
			if (validateLastName == false) {
				isValid = false;
			}

			//EMAIL
			var validateEmail = f7.input.validateInputs("#register-email");
			if (validateEmail == false) {
				isValid = false;
			}

			//PASSWORD
			var validatePassword =
				f7.input.validateInputs("#register-password");
			if (validatePassword == false) {
				isValid = false;
			}

			//CODE
			var validateCode = f7.input.validateInputs("#register-code");
			if (validateCode == false) {
				isValid = false;
			}

			//Valid data
			if (isValid === true) {
				f7.preloader.show();

				// Data
				var data = {
					firstname: this.registerFirstName,
					lastname: this.registerLastName,
					email: this.registerEmail,
					password: this.registerPassword,
					code: this.registerCode,
				};

				// Parameters
				var url = store.state.url + "api/post/register";
				var method = "POST";

				//Post data
				await this.fetch(url, method, data, this.success, this.failure);
			}
			//Invalid data
			else {
				f7.dialog.alert("Please check all fields are filled in.");
			}
		},
		success(response) {
			f7.preloader.hide();
			f7.dialog.alert(response.message);
			f7.sheet.close("#sheet-register");
			this.clearForm();
		},
		failure(response) {
			f7.preloader.hide();
			f7.dialog.alert(response.message);
		}
	},
	mounted() {
		f7ready((f7) => {
			f7.sheet.create({
				el: this.sheetId,
				closeByBackdropClick: true,
				swipeToClose: true,
				backdrop: true,
			});
		});
	},
};
</script>

<style scoped>
@media (min-width: 1024px) {
	.sheet-modal {
		margin-left: 25%;
		width: 50% !important;
	}
}
</style>