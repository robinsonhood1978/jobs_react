import { _get,_put, _post, _gets } from './index';
// update note detail
export const updateNote = (id, data) => {
  console.log('id:', id);
  const req = {
    data,
    url: `notes/${id}`
  };
  return _put(req);
};
// get job detail
export const getNote = (id) => {
  const req = {
    url: `notes/${id}`
  };
  return _gets(req);
};
// new note
export const newNote = data => {
  const req = {
    data,
    url: `notes`
  };
  return _post(req);
};
// get notes list
export const notes = (jobId) => {
  // console.log('jobId:', jobId)
  const req = {
    url: `notes/?jobId=${jobId}`
  };
  return _gets(req);
};
// update job detail
export const updateJob = (id, data) => {
  const req = {
    data,
    url: `jobs/${id}`
  };
  return _put(req);
};

// get job detail
export const getjob = (id) => {
  const req = {
    url: `jobs/${id}`
  };
  return _gets(req);
};
// get jobs list
export const jobs = () => {
  const req = {
    url: 'jobs'
  };
  return _gets(req);
};
// new job
export const newjob = data => {
  const req = {
    data,
    url: `jobs`
  };
  return _post(req);
};
// 注册
export const register = data => {
  const req = {
    data,
    url: `register`
  };
  return _post(req);
};
// 登录
export const login = data => {
  const req = {
    data,
    url: 'login'
  };
  return _post(req);
};

// 修改密码
export const adminChangePassword = data => {
  const req = {
    data,
    url: 'admin/admin_change_password'
  };
  return _post(req);
};

// 登录
export const loginPhone = data => {
  const req = {
    data,
    url: 'admin/admin_login_phone'
  };
  return _post(req);
};

// 忘记密码
export const forgetPassword = data => {
  const req = {
    data,
    url: 'admin/forget_password'
  };
  return _post(req);
};

// 获取验证码
export const getVerify = data => {
  const req = {
    data,
    url: 'admin/admin_verify'
  };
  return _get(req);
};

// 登出
export const logout = () => {
  const req = {
    url: 'admin/admin_logout'
  };
  sessionStorage.clear();
  return _post(req);
};

// 获取商户信息
export const getMyInfo = data => {
  const req = {
    data,
    url: 'admin/admin_info'
  };
  return _get(req);
};

// 提现
export const withdraw = data => {
  const req = {
    data,
    url: 'admin/withdraw'
  };
  return _post(req);
};

export const getAdvertises = data => {
  const req = {
    data,
    url: 'admin/my_advertisings'
  };
  return _get(req);
};

export const addAdvertise = data => {
  const req = {
    data,
    url: 'manage/advertising'
  };
  return _post(req);
};

export const getAdvertise = data => {
  const req = {
    url: `manage/advertising/${data}`
  };
  return _get(req);
};

export const updateAdvertising = data => {
  const req = {
    data,
    url: `manage/advertising/${data.id}`
  };
  return _put(req);
};

export const updatePic = data => {
  const req = {
    data,
    url: `manage/update_pic/${data.advertising_id}`
  };
  return _put(req);
};

export const updateAdvertisePhotos = data => {
  const req = {
    data,
    url: `manage/advertising_photos/${data.advertising_id}`
  };
  return _put(req);
};
// 下订单
export const makeOrder = data => {
  const req = {
    data,
    url: 'admin/order'
  };
  return _post(req);
};
// 得到本商户全部订单
export const myOrders = data => {
  const req = {
    data,
    url: 'admin/my_orders'
  };
  return _get(req);
};
// 单个订单
export const myOrder = data => {
  const req = {
    data,
    url: `admin/order/${data.id}`
  };
  return _get(req);
};
// pay
export const pay = data => {
  const req = {
    data,
    url: 'admin/pay'
  };
  return _post(req);
};