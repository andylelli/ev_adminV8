<template>
	<f7-list class="no-margin-top">
		<f7-list-item
			title="Settings"
			:link="'/' + page + '-settings/' + projectid + '/'"
		>
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
	</f7-list>
</template>

<script>

export default {
	name: "general-settings",
	data() {
		return {};
	},
	props: ["page", "projectid"],
	components: {},
	mixins: [],
	computed: {},
	methods: {},
	mounted() {},
};
</script>
