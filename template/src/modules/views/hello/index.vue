<template>
  <div class="page page-hello">
    <div class="page-content">
      <!-- 静态资源路径写法事例 -->
      <img src="~@assets/images/copyfiles/logo.png">
      <h1 v-text="msg"></h1>
      <h2 v-text="message"></h2>
      <div>数据返回：<span v-text="orderInfo"></span></div>
      <div class="demo">
        <h3>方法示例</h3>
        <pre>
          &lt;script&gt;
            /**
             * 以下仅为事例代码，可以随意扩展修改
             */

            // 工具类
            import {formatDate} from &#x27;utils&#x27;;
            // 组件
            import SendCode from &#x27;@components/SendCode&#x27;;

            export default {
              data() {
                return {
                  msg: &#x27;Welcome to Your Vue.js App SSR&#x27;,
                  message: &#x27;现在时间是：&#x27;,
                  start: false
                }
              },
              asyncData ({ store }) {
                return store.dispatch(&#x27;FETCH_ORDER_INFO&#x27;);
              },
              computed: {
                orderInfo() {
                  return this.$store.state.orderInfo;
                }
              },
              created() {
                this.message = formatDate(Date.now());
              }
            }
          &lt;/script&gt;
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
  /**
   * 以下仅为事例代码，可以随意扩展修改
   */

  // 工具类
  import {formatDate} from 'utils';
  // 组件
  import SendCode from '@components/SendCode';

  export default {
    data() {
      return {
        msg: 'Welcome to Your Vue.js App SSR',
        message: '现在时间是：',
        start: false
      }
    },
    asyncData ({ store }) {
      return store.dispatch('FETCH_ORDER_INFO');
    },
    computed: {
      orderInfo() {
        return this.$store.state.orderInfo;
      }
    },
    created() {
      this.message = formatDate(Date.now());
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "./style.less";
</style>
