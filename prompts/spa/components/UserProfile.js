class UserProfile {
  constructor(id) {
    this.id = id;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.id = 'user-profile-wrapper';
    wrapper.textContent = `This is the profile for user with id ${this.id}`;
    return wrapper;
  }
}
