import services from 'services';

const actions = {
  async FETCH_ORDER_INFO({commit}) {
    const data = {};

    try {
      const res = await services.purchaseOrderDetails({data, method: 'get'});
      commit('FETCH_ORDER_INFO', res);
    } catch (err) {
      console.log('异常' + JSON.stringify(err));
    }

  }
}
export default actions;
