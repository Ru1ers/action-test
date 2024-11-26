<template>
	<view class="content">
		{{title}}
	</view>
</template>
<script setup>
	import {
		useIndexStore
	} from "../../store/index.js"
	import {
		computed
	} from 'vue';
	const indexStore = useIndexStore()
	const title = computed(() => {
		return indexStore.pageHeight
	})
</script>
<style>
</style>