// ----------------------------------------------------------------------

const account = {
  displayName: sessionStorage.getItem("name"),
  email: sessionStorage.getItem("email"),
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
};

export default account;
