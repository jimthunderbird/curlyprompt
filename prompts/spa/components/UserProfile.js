class UserProfile {
  constructor(id) {
    this.id = id;
  }

  render() {
    const div = document.createElement('div');
    div.id = 'user-profile';
    div.textContent = `This is the user profile for user with id ${this.id}`;
    return div;
  }
}
