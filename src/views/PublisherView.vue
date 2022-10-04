<template>
  <v-app>
    <v-main class="blue">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet rounded="xl" elevation="15">
              <v-data-table :headers="headers" :items="publishers" :search="search" loading="items"
                loading-text="Carregando dados... Aguarde!" no-data-text="Nenhum usuário encontrado."
                :footer-props="{itemsPerPageText: 'Linhas por página'}" class="rounded-xl pa-3">

                <template v-slot:top>
                  <v-toolbar flat class="rounded-xl rounded-b-0">
                    <v-toolbar-title class="headline"><span>Editoras</span></v-toolbar-title>

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
                                :rules="[rules.required, rules.min_counter, rules.counter_name]" counter="80"
                                maxlength="80" append-icon="mdi-bookshelf "></v-text-field>

                              <v-text-field v-model="editedItem.city" label="Cidade" color="blue"
                                :rules="[rules.required, rules.min_counter, rules.counter_city]" counter="50"
                                maxlength="50" append-icon="mdi-city-variant-outline"></v-text-field>
                            </v-container>
                          </v-card-text>

                          <v-card-actions>

                            <v-spacer></v-spacer>

                            <v-btn color="red darken-1" class="mb-2" text @click="close">
                              Cancelar
                            </v-btn>
                            <v-btn color="blue darken-1" class="mb-2 mr-2" text @click="save" :disabled="awaitPublisher">
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
                      hide-details>
                    </v-text-field>
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
import PublisherDataService from '../services/PublisherDataService'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    search: '',
    awaitPublisher: true,
    headers: [
      {
        text: 'Id',
        align: 'start',
        value: 'id',
      },
      { text: 'Nome', value: 'name' },
      { text: 'Cidade', value: 'city' },
      { text: 'Ações', align: 'center', value: 'actions', sortable: false },
    ],
    publishers: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      city: '',
    },
    defaultItem: {
      name: '',
      city: '',
    },
    rules: {
      required: value => !!value || 'Campo obrigatorio!',
      counter_name: value => value.length <= 80 || 'Max 80 caracteres.',
      counter_city: value => value.length <= 50 || 'Max 50 caracteres.',
      min_counter: value => value.length >= 3 || 'Min 3 caracteres.',
    },
    valid: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nova Editora' : 'Editar Editora'
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
    async listPublishers() {
      this.awaitPublisher = true
      await PublisherDataService.getAll()
        .then((response) => {
          this.publishers = response.data;
          this.awaitPublisher = false
          console.log(response.data);
        })
        .catch((e) => {
          this.awaitPublisher = true
          console.log(e);
        });
    },

    editItem(item) {
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.PublisherDelete()
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
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          this.PublisherUpdate()
        } else {
          this.PublisherPost()
        }
      }
    },

    async PublisherPost() {
      this.awaitPublisher = true
      await PublisherDataService.create(this.editedItem).then(() => this.listPublishers()).then(() => this.showAlertSuccessPost()).then(() => this.awaitPublisher = false).then(() => this.close())
        .catch((e) => {
          this.showAlertErrorPost()
          this.awaitPublisher = false
          console.log(e)
        });
    },

    async PublisherUpdate() {
      this.awaitPublisher = true
      await PublisherDataService.update(this.editedIndex, this.editedItem).then(() => this.listPublishers()).then(() => this.showAlertSuccessUpdate()).then(() => this.awaitPublisher = false).then(() => this.close())
        .catch((e) => {
          this.showAlertErrorUpdate()
          this.awaitPublisher = false
          console.log(e)
        });
    },

    async PublisherDelete() {
      await PublisherDataService.delete(this.editedIndex).then(() => this.listPublishers()).then(() => this.showAlertSuccessDelete()).then(() => this.close())
        .catch((e) => {
          this.showAlertErrorDelete()
          console.log(e)
        })
    },

    showAlertSuccessPost() {
      this.$swal("", "Editora cadastrado com sucesso!", "success");
    },

    showAlertSuccessUpdate() {
      this.$swal("", "Editora atualizado com sucesso!", "success");
    },

    showAlertSuccessDelete() {
      this.$swal("", "Editora deletado com sucesso!", "success");
    },

    showAlertErrorPost() {
      this.$swal("Oops...", "Esse nome de editora já existe!", "error");
    },

    showAlertErrorUpdate() {
      this.$swal("Oops...", "Esse nome de editora já existe!", "error");
    },

    showAlertErrorDelete() {
      this.$swal("Oops...", "Essa editora tem um ou mais livros registrados!", "error");
    },

  },

  mounted() {
    this.listPublishers();
  }
}
</script>

<style>
.round {
  border-radius: 30px;
}
</style>