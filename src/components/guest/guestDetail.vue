<template>
	<div>
		<field-edit-text
			type="first"
			:id="this.guestid"
			table="guest"
			fieldname="firstname"
		></field-edit-text>
		<field-edit-text
			:id="this.guestid"
			table="guest"
			fieldname="lastname"
		></field-edit-text>
		<field-edit-text
			type="last"
			:id="this.guestid"
			table="guest"
			fieldname="email"
		></field-edit-text>
	</div>
</template>

<script>
import fieldEditText from "../misc/fieldEditText.vue";

export default {
	name: "guest-detail",
	data() {
		return {};
	},
	components: { fieldEditText },
	props: {
		guestid: Number,
	},
	inject: ["eventBus"],
	computed: {
		getGuest() {
			var id = this.id;
			var find = store.state.guest.filter(function (result) {
				return result.guest_id === id && result.guest_role === 2;
			});
			if (find.length > 0) {
				return find[0];
			}
		},
	},
	methods: {
		editGuest() {
			var json = {
				table: "guest",
				id: this.guestid,
				data: {
					firstname: this.getGuest.guest_firstname,
					lastname: this.getGuest.guest_lastname,
					email: this.getGuest.guest_email,
				},
			};
			this.eventBus.emit("edit-guest", json);
		},
	},
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->