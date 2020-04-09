<template>
  <div class="col-md-12">
    <div class="card card-container">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
          <div v-if="isDriver()" class="form-group">
            <label for="phonenumber">Mobile Phone Number</label>
            <input
              v-model="user.phone_number"
              v-validate="isDriver() ? '' : 'required'"
              type="text"
              class="form-control"
              name="phonenumber"
            />
            <div
              v-if="submitted && errors.has('phonenumber')"
              class="alert-danger"
            >{{errors.first('phonenumber')}}</div>
          </div>
          <div v-else class="form-group">
            <label for="username">Username</label>
            <input
              v-model="user.username"
              v-validate="isDriver() ? '' : 'required|max:20'"
              type="text"
              class="form-control"
              name="username"
            />
            <div
              v-if="submitted && errors.has('username')"
              class="alert-danger"
            >{{errors.first('username')}}</div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="user.password"
              v-validate="'required|min:6|max:40'"
              type="password"
              class="form-control"
              name="password"
            />
            <div
              v-if="submitted && errors.has('password')"
              class="alert-danger"
            >{{errors.first('password')}}</div>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" :disabled="loading">
              <span v-show="loading" class="spinner-border spinner-border-sm"></span>
              <span>Sign Up</span>
            </button>
          </div>
        </div>
      </form>

      <div
        v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  data() {
    return {
      user: new User('', '', '', '', '', this.$route.params.type),
      submitted: false,
      successful: false,
      loading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    isDriver() {
      return this.$route.params.type == "driver";
    },
    handleRegister() {
      this.loading = true;
      this.message = '';
      this.submitted = true;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            () => {
              this.$router.push('/');
            },
            error => {
              this.message = 
                (error.response && error.response.data.message) ||
                error.message ||
                error.toString();
              this.successful = false;
              this.loading = false;
            }
          );
        } else {
          this.loading = false;
        }
      });
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