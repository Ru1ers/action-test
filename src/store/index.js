import {
	defineStore
} from 'pinia'

export const useIndexStore = defineStore('index', {
	state: () => ({
		pageHeight: 123123
	}),
	actions: {
		setPageHeight(value) {
			this.pageHeight = value
			uni.setStorageSync('pageHeight', value)
		},
	}
})