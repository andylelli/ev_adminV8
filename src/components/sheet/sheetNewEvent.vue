<template>
	<f7-sheet
		class="justify-content-center"
		:id="this.sheetId"
		style="height: auto; --f7-sheet-bg-color: #fff"
		swipe-to-close
		backdrop
		@sheet:closed="clearForm()"
		@sheet:open="clearForm()"
	>
		<f7-page-content>
			<f7-block class="padding-top">
				<f7-block-title class="padding-bottom">
					{{ this.title }}</f7-block-title
				>
				<f7-list form>
					<f7-list-input
						class="new-field"
						id="name"
						type="text"
						step="0.01"
						placeholder="Name"
						@input="update($event)"
						validate
						required
					></f7-list-input>
				</f7-list>
				<div
					style="
						padding-left: 25px;
						padding-right: 25px;
						height: 50px;
					"
				>
					<div v-show="this.allowChange === true">
						<general-button
							class="margin-top margin-bottom"
							@generalButtonAction="submit()"
							label="CREATE"
							width="200"
							type="fill"
						></general-button>
					</div>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import newItem from "../../mixins/newItem";
import login from "../../mixins/login";
import fetch from "../../mixins/fetch";

import generalButton from "../misc/generalButton.vue";

export default {
	name: "sheet-new-event",
	data() {
		return {
			sheetId: "new-event",
			table: "event",
			displayName: "Event",
			title: "NEW EVENT",
			value: "",
			preloader: true,
			allowChange: false,
		};
	},
	mixins: [misc, newItem, login, fetch],
	components: {
		generalButton,
	},
	computed: {},
	methods: {
		update(event) {
			this.value = event.target.value;
			this.allowChange = this.isValid();
		},
		clearForm() {
			this.value = "";
			this.allowChange = false;
		},
		isValid() {
			var validate = f7.input.validateInputs(this.sheetId);
			if (validate == true) {
				return true;
			} else {
				return false;
			}
		},
		submit() {
			var validate = f7.input.validateInputs(this.sheetId);

			if (validate) {
				var json = {
					userid: parseInt(localStorage.admin_userid),
					table: this.table,
					name: this.value,
				};

				this.newItem(
					json,
					this.table,
					this.preloader,
					this.displayName
				);
				f7.sheet.close("#" + this.sheetId);
			}
		},
	},
	mounted() {
		f7ready((f7) => {});
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
