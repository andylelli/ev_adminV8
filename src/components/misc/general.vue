<template>
	<div>
		<f7-block-header>GENERAL</f7-block-header>
		<f7-list class="ripple-color-primary no-margin-top no-padding-top">
			<f7-list-item link="/event-settings/" title="Settings">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'cog']"
						/>
					</f7-icon>
				</template>
			</f7-list-item>
			<f7-list-item link="/guest/" title="Guests">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'users']"
						/>
					</f7-icon>
				</template>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";

var $$ = Dom7;

export default {
	name: "general",
	data() {
		return {
		};
	},
	mixins: [],
	methods: {},
	mounted() {
		f7ready((f7) => {
			$$(".item-link").addClass("ripple-color-primary");
		});
	},
};
</script>

<style scoped>
.ripple-color-primary {
	--f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.15);
}
</style>