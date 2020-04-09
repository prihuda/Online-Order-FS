<template>
  <div class="col-md-12">
    <div class="container">
      <header class="jumbotron">
        <h3>Profile</h3>
      </header>
      <b-tabs content-class="mt-3" align="center">
        <b-tab title="Details" active>
          <p>Name: {{ user.full_name }}</p>
          <p v-if="!isDriver">Email: {{ user.email }}</p>
          <p>Mobile Phone Number: {{ user.phone_number }}</p>
        </b-tab>
        <b-tab title="Edit">
          <form name="form" @submit.prevent="handleRegister">
            <div v-if="!successful">
              <div class="form-group">
                <label for="fullname">Name</label>
                <input
                  v-model="user.full_name"
                  type="text"
                  class="form-control"
                  name="fullname"
                />
              </div>
              <div v-if="!isDriver" class="form-group">
                <label for="email">Email</label>
                <input
                  v-model="user.email"
                  type="text"
                  class="form-control"
                  name="email"
                />
              </div>
              <div class="form-group">
                <label for="phonenumber">Mobile Phone Number</label>
                <input
                  v-model="user.phone_number"
                  type="text"
                  class="form-control"
                  name="phonenumber"
                />
              </div>
              <div class="form-group">
                <button class="btn btn-primary">Save</button>
              </div>
            </div>
          </form>
        </b-tab>
      </b-tabs>
      <div
        v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';
import UserService from '../services/user.service';

export default {
  data() {
    return {
      isDriver: this.$store.state.auth.user.type == "driver",
      user: new User(
        '', 
        this.$store.state.auth.user.fullname,
        this.isDriver?
        '' : this.$store.state.auth.user.email,
        this.$store.state.auth.user.phonenumber,
        '',
        this.$store.state.auth.user.type
      ),
      id: 0,
      stat:'',
      submitted: false,
      successful: false,
      message: ''
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      UserService.editProfile(this.user, this.id).then(
        (response) => {
          localStorage.setItem('user', JSON.stringify(response.data.data));
          this.$store.commit('auth/loginSuccess', response.data.data);
        },
        error => {
          this.message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #f7f7f7;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>