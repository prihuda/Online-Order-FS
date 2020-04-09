<template>
  <div id="app">
    
    <nav class="navbar sticky-top navbar-expand navbar-dark bg-dark">
      <a href class="navbar-brand" @click.prevent>SHOPPA!</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" />Home
          </router-link>
        </li>
        <li v-if="currentUser" class="nav-item">
          <router-link v-if="isDriver" to="/orders" class="nav-link">
            <font-awesome-icon icon="clipboard-list" />
            My Orders
          </router-link>
          <router-link v-else to="#" class="nav-link">
            <font-awesome-icon icon="shopping-cart" />
            My Cart
          </router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item dropdown">
          <b-nav-item-dropdown
            id="my-nav-dropdown"
            toggle-class="nav-link-custom"
            right
          >
            <template slot="button-content">
              <font-awesome-icon icon="user-plus" />Sign Up
            </template>
            <b-dropdown-item>
              <router-link :to="{ name: 'register', params: { type: 'customer' }}" class="dropdown-item">
                Customer
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="{ name: 'register', params: { type: 'driver' }}" class="dropdown-item">
                Driver
              </router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </li>

        <li class="nav-item dropdown">
          <b-nav-item-dropdown
            id="my-nav-dropdown"
            text="Login"
            toggle-class="nav-link-custom"
            right
          >
            <b-dropdown-item>
              <router-link :to="{ name: 'login', params: { type: 'customer' }}" class="dropdown-item">
                Customer
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="{ name: 'login', params: { type: 'driver' }}" class="dropdown-item">
                Driver
              </router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link v-if="isDriver" :to="{ name: 'driver', params: { id: id }}" class="nav-link">
            <font-awesome-icon icon="motorcycle" />
            {{ fullname }}
          </router-link>
          <router-link v-else :to="{ name: 'customer', params: { id: id }}" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" />LogOut
          </a>
        </li>
      </div>
    </nav>
    
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    id() {
      return this.$store.state.auth.user.id
    },
    fullname() {
      return this.$store.state.auth.user.fullname
    },
    username() {
      return this.$store.state.auth.user.username
    },
    currentUser: function() {
      return this.$store.state.auth.status.loggedIn
    },
    isDriver: function() {
      return this.$store.state.auth.user.type == "driver";
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout', this.$store.state.auth.user);
      if (this.$route.path != '/') this.$router.push('/');
    }
  }
};
</script>
