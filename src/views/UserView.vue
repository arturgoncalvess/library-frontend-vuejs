<template>
  <v-app>
    <v-main class="blue">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet rounded="xl" elevation="15">
              <v-data-table :headers="headers" :items="users" :search="search" loading="items"
                loading-text="Carregando dados... Aguarde!" no-data-text="Nenhum usuário encontrado."
                :footer-props="{itemsPerPageText: 'Linhas por página'}" class="rounded-xl pa-3">

                <template v-slot:top>
                  <v-toolbar flat class="rounded-xl rounded-b-0">
                    <v-toolbar-title class="headline"><span>Usuários</span></v-toolbar-title>

                    <v-divider class="mx-4" inset vertical></v-divider>

                    <v-dialog v-model="dialog" persistent max-width="500px" content-class="round">

                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="elevation-5" color="blue" dark v-bind="attrs" v-on="on">
                          Novo
                          <v-icon class="ml-1">mdi-plus</v-icon>
                        </v-btn>
                      </template>

                      <v-card>
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-card-title class="headline">
                            <span class="ml-3 mt-2">{{ formTitle }}</span>
                          </v-card-title>

                          <v-spacer></v-spacer>

                          <v-card-text>
                            <v-container>
                              <v-text-field v-model="editedItem.name" label="Nome" color="blue"
                                :rules="[rules.required, rules.min_counter, rules.counter]" counter="35" maxlength="35"
                                append-icon="mdi-account"></v-text-field>

                              <v-text-field v-model="editedItem.city" label="Cidade" color="blue"
                                :rules="[rules.required, rules.min_counter, rules.counter]" counter="35" maxlength="35"
                                append-icon="mdi-city-variant-outline"></v-text-field>

                              <v-text-field v-model="editedItem.address" label="Endereço" color="blue"
                                :rules="[rules.required, rules.min_counter, rules.counter]" counter="35" maxlength="35"
                                append-icon="mdi-home-city-outline"></v-text-field>

                              <v-text-field v-model="editedItem.email" label="Email" color="blue"
                                :rules="[rules.required, rules.email]" append-icon="mdi-email-outline">
                              </v-text-field>
                            </v-container>
                          </v-card-text>

                          <v-card-actions>

                            <v-spacer></v-spacer>

                            <v-btn color="red darken-1" class="mb-2" text @click="close">
                              Cancelar
                            </v-btn>
                            <v-btn color="blue darken-1" class="mb-2 mr-2" text @click="save" :disabled="awaitUser">
                              Salvar
                            </v-btn>
                          </v-card-actions>

                        </v-form>
                      </v-card>

                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="455px" persistent content-class="round">
                      <v-card>
                        <v-card-title class="headline"><span>Você quer realmente deletar?</span></v-card-title>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                          <v-btn color="red darken-1" text @click="deleteItemConfirm">Sim</v-btn>
                          <v-spacer></v-spacer>
                        </v-card-actions>

                      </v-card>
                    </v-dialog>

                    <v-spacer></v-spacer>

                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" color="blue" single-line
                      hide-details></v-text-field>
                  </v-toolbar>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top color="blue">

                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="blue" size="23px" class="mr-2" v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-lead-pencil
                      </v-icon>
                    </template>

                    <span>Editar</span>
                  </v-tooltip>

                  <v-tooltip top color="red">

                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="red" size="23px" v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>

                    <span>Excluir</span>
                  </v-tooltip>
                </template>

              </v-data-table>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import UserDataService from '../services/UserDataService'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    awaitUser: true,
    headers: [
      {
        text: 'Id',
        align: 'start',
        value: 'id',
      },
      { text: 'Nome', value: 'name', },
      { text: 'Cidade', value: 'city', },
      { text: 'Endereço', value: 'address', },
      { text: 'Email', value: 'email', },
      { text: 'Ações', align: 'center', value: 'actions', sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      city: '',
      address: '',
      email: '',
    },
    defaultItem: {
      name: '',
      city: '',
      address: '',
      email: '',
    },
    rules: {
      required: value => !!value || 'Campo obrigatorio!',
      counter: value => value.length <= 35 || 'Max 35 caracteres.',
      min_counter: value => value.length >= 3 || 'Min 3 caracteres.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'E-mail inválido!'
      },
    },
    valid: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Usuário' : 'Editar Usuário'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  methods: {
    async listUsers() {
      await UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
          console.log(response.data);
          this.awaitUser = false
        })
        .catch((e) => {
          this.awaitBook = true
          console.log(e);
        });
    },

    editItem(item) {
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.deletedIndex = item.id
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.UserDelete()
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$refs.form.resetValidation();
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.deletedIndex = -1
      }) 
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          this.UserUpdate()
        } else {
          this.UserPost()
        }
      }
    },

    async UserPost() {
      this.awaitUser = true
      await UserDataService.create(this.editedItem).then(() => this.listUsers()).then(() => this.showAlertSuccessPost()).then(() => this.awaitUser = false).then(() => this.close())
        .catch((e) => {
          this.showAlertErrorPost()
          this.awaitUser = false
          console.log(e)
        });
    },

    async UserUpdate() {
      this.awaitUser = true
      await UserDataService.update(this.editedIndex, this.editedItem).then(() => this.listUsers()).then(() => this.showAlertSuccessUpdate()).then(() => this.awaitUser = false).then(() => this.close())
        .catch((e) => {
          this.showAlertErrorUpdate()
          this.awaitUser = false
          console.log(e)
        });
    },

    async UserDelete() {
      await UserDataService.delete(this.deletedIndex).then(() => this.listUsers()).then(() => this.showAlertSuccessDelete())
        .catch((e) => {
          this.showAlertErrorDelete()
          console.log(e)
        })
    },

    showAlertSuccessPost() {
      this.$swal("", "Usuário cadastrado com sucesso!", "success");
    },

    showAlertSuccessUpdate() {
      this.$swal("", "Usuário atualizado com sucesso!", "success");
    },

    showAlertSuccessDelete() {
      this.$swal("", "Usuário deletado com sucesso!", "success");
    },

    showAlertErrorPost() {
      this.$swal("Oops...", "Esse email já existe no sistema.", "error");
    },

    showAlertErrorUpdate() {
      this.$swal("Oops...", "Esse email já existe no sistema.", "error");
    },

    showAlertErrorDelete() {
      this.$swal("Oops...", "Esse usuário tem um ou mais alugueis.", "error");
    },

  },

  mounted() {
    this.listUsers();
  }
}
</script>

<style>
.round {
  border-radius: 30px;
}
</style>