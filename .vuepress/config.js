/*
 * @Author: GengHH
 * @Date: 2022-08-16 10:50:18
 * @LastEditors: GengHH
 * @LastEditTime: 2022-08-18 11:22:40
 * @Description: file content
 * @FilePath: \gitHubPage\GengHH.Blog\.vuepress\config.js
 */
module.exports = {
	title: "Genghh's Blog",
	description: 'use vuepress@1.x and vuepress-theme-reco ',
	dest: 'public',
	head: [
		[
			'link',
			{
				rel: 'icon',
				href: '/favicon.ico',
			},
		],
		[
			'meta',
			{
				name: 'viewport',
				content: 'width=device-width,initial-scale=1,user-scalable=no',
			},
		],
	],
	theme: 'reco',
	themeConfig: {
		nav: [
			{
				text: 'Home',
				link: '/',
				icon: 'reco-home',
			},
			{
				text: 'TimeLine',
				link: '/timeline/',
				icon: 'reco-date',
			},
			{
				text: 'Docs',
				icon: 'reco-message',
				items: [
					{
						text: 'vuepress-reco',
						link: '/docs/theme-reco/',
					},
					{
						text: 'learn',
						link: '/docs/learn/',
					},
				],
			},
			{
				text: 'Contact',
				icon: 'reco-message',
				items: [
					{
						text: 'GitHub',
						link: 'https://github.com/GengHH',
						icon: 'reco-github',
					},
				],
			},
		],
		sidebar: {
			'/docs/theme-reco/': ['', 'theme', 'plugin', 'api'],
			'/docs/learn/': ['', 'vue', 'docker'],
		},
		type: 'blog',
		blogConfig: {
			category: {
				location: 2,
				text: 'Category',
			},
			tag: {
				location: 3,
				text: 'Tag',
			},
		},
		friendLink: [
			{
				title: '午后南杂',
				desc: 'Enjoy when you can, and endure when you must.',
				email: '1156743527@qq.com',
				link: 'https://www.recoluan.com',
			},
			{
				title: 'vuepress-theme-reco',
				desc: 'A simple and beautiful vuepress Blog & Doc theme.',
				avatar:
					'https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png',
				link: 'https://vuepress-theme-reco.recoluan.com',
			},
		],
		logo: '/logo.png',
		search: true,
		searchMaxSuggestions: 10,
		lastUpdated: 'Last Updated',
		author: 'GengHH',
		authorAvatar: '/avatar.png',
		record: 'xxxx',
		startYear: '2017',
	},
	markdown: {
		lineNumbers: true,
	},
};
