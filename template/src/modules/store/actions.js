import services from 'services';

const actions = {
  async FETCH_TENANT_INFO({commit}) {
    const data = {
      city: 'CHSH000000'
    };
    let res = null;

    try {
      res = await services.heartIndexFuture24h({data, method: 'get'});
    } catch (err) {
      res = err;
      console.log('异常' + JSON.stringify(err));
    }
    commit('FETCH_TENANT_INFO', res);
  }
}
export default actions;
