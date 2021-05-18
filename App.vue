<script>
export default {
  onLaunch: function () {
    // if (!(uni.getStorageSync('token'))) {
    //   uni.showToast({ title: '未登录', icon: 'none' })
    //   setTimeout(() => {
    //     uni.reLaunch({ url: '/pages/login/login' })
    //   }, 2000)
    // }
  },
  onShow: function () {
  },
  onHide: function () {
  },
  globalData: {
    codeId: '',
  },
  methods: {

  }
}
</script>

<style>
/*每个页面公共css */
/* uni-page-wrapper,uni-page-body,uni-page,.uni-app--maxwidth{
		width: 100%;
		display: block;
	} */
</style>
