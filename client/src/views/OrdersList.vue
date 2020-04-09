<template>
  <div v-if="created" class="container">
    <header class="jumbotron">
      <h3>Orders</h3>
    </header>
      <b-table striped hover :items="items" :fields="fields">
        <template v-slot:cell(orders)="row">
          <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
            Show Details
          </b-button>
        </template>
        <template v-slot:cell(statusx)="row">
          <b-form-select size="sm" v-model="row.item.status" :options="options" @change="changeselect(row.item)">
          </b-form-select>
        </template>
      </b-table>
      
    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
      <b-table striped hover :items="infoModal.items" :fields="fields2">
      </b-table>
    </b-modal>
    <div
        v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
  </div>
</template>

<script>
import UserService from '../services/user.service';

export default {
  name: 'User',
  data() {
    return {
      created: false,
      message: '',
      items: [],
      fields: [
        {
          key: 'date',
          formatter: 'localTime'
        }, 
        {
          key:'customer.customer_name',
          label: 'Customer Name'
        },
        {
          key:'customer.phone_number',
          label: 'Customer Phone'
        },
        {
          key: 'orders',
          label: 'Order Items'
        },
        {
          key: 'statusx',
          label: 'Status'
        }
      ],
      fields2: [
        {
          key: 'Product.name',
          label: 'Product Name'
        }, 
        {
          key:'quantity',
          label: 'Quantity'
        }
      ],
      infoModal: {
        id: 'info-modal',
        title: '',
        items: []
      },
      options: [
        {text: 'Accepted', value: 'accepted', disabled: false},
        {text: 'Sending', value: 'sending', disabled: false}
      ]
    };
  },
  created() {
    UserService.getOrders(this.$store.state.auth.user.id).then(
      response => {
        this.items = response.data.data;
        // eslint-disable-next-line no-console
        //console.log(response.data.data);
        this.created = true;
      },
      error => {
        if (error == 'Error: Request failed with status code 401') {
          this.$store.dispatch('auth/logout');
          this.$router.push('/');
        }
        else {
          this.message =
            (error.response && error.response.data) ||
            error.status ||
            error;
        }         
      }
    );
  },
  methods: {
    localTime: function(date) {
      let d = new Date(date);
      return d.toLocaleString('id-ID');
    },
    info(item, index, button) {
      // eslint-disable-next-line no-console
      //console.log(item);
      this.infoModal.title = 'Order Details'
      this.infoModal.items = item.order_detail
      this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    },
    changeselect(item) {
      UserService.setStatus(this.$store.state.auth.user.id, item.id, item.status).then(
        () => {
          
        },
        error => {
          if (error == 'Error: Request failed with status code 401') {
            this.$store.dispatch('auth/logout');
            this.$router.push('/');
          }
          else {
            this.message =
              (error.response && error.response.data) ||
              error.status ||
              error;
          }         
        }
      );
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
  }
};
</script>

<style scoped>
button {
  margin-left: 5px;
  margin-right: 5px;
}
</style>