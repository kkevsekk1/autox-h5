<script>
export default {
  onLaunch: function () {
    try {
      let code = this._router.history.current.query.code
      if (code) {
        uni.setStorageSync("inviteCode", code)
      }
    } catch (error) {
      console.log('获取邀请码失败', error)
    }
    try {
      let fid = this._router.history.current.query.f
      if (fid) {
        uni.setStorageSync("fid", fid)
      }
    } catch (error) {

    }

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
