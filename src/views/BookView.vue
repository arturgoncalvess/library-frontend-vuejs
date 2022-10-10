<template>
  <v-app>
    <v-main class="blue">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet rounded="xl" elevation="15">
              <v-data-table :headers="headers" :items="books" :search="search" loading="items"
                loading-text="Carregando dados... Aguarde!" no-data-text="Nenhum usuário encontrado."
                :footer-props="{itemsPerPageText: 'Linhas por página'}" class="rounded-xl pa-3">

                <template v-slot:top>
                  <v-toolbar flat class="rounded-xl rounded-b-0">
                    <v-toolbar-title class="headline"><span>Livros</span></v-toolbar-title>

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
                                :rules="[rules.required, rules.min_counter, rules.counter_book]" counter="120"
                                maxlength="120" append-icon="mdi-book-outline"></v-text-field>

                              <v-text-field v-model="editedItem.author" label="Autor" color="blue"
                                :rules="[rules.required, rules.min_counter, rules.counter_author]" counter="35"
                                maxlength="35" append-icon="mdi-account-box-outline"></v-text-field>

                              <v-select v-model="editedItem.publisherId" :items="publishers" item-text="name"
                                item-value="id" label="Editora" color="blue" :rules="[rules.required]"
                                append-icon="mdi-bookshelf"></v-select>

                              <v-menu ref="menu" v-model="menu" :close-on-content-click="false"
                                :return-value.sync="editedItem.launch" transition="scale-transition" offset-y
                                min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="editedItem.launch" label="Data de lançamento" color="blue"
                                    :rules="[rules.required]" append-icon="mdi-calendar-today-outline" readonly
                                    v-bind="attrs" v-on="on">
                                  </v-text-field>
                                </template>

                                <v-date-picker v-model="editedItem.launch" locale="pt-br" no-title scrollable color="blue"
                                  :max="nowDate">

                                  <v-spacer></v-spacer>

                                  <v-btn text @click="menu = false"> Cancelar </v-btn>
                                  <v-btn text color="blue" @click="$refs.menu.save(editedItem.launch)"> OK
                                  </v-btn>
                                </v-date-picker>

                              </v-menu>

                              <v-text-field v-model="editedItem.quantity" label="Quantidade" color="blue" type="number"
                                :rules="[rules.min_number]" append-icon="mdi-numeric">
                              </v-text-field>
                            </v-container>
                          </v-card-text>

                          <v-card-actions>

                            <v-spacer></v-spacer>

                            <v-btn color="red darken-1" class="mb-2" text @click="close">
                              Cancelar
                            </v-btn>
                            <v-btn color="blue darken-1" class="mb-2 mr-2" text @click="save" :disabled="awaitBook">
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

                <template v-slot:[`item.quantity`]="{ item }">
                  <v-chip class="elevation-3" :color="getColor(item.quantity)" dark>
                    {{ item.quantity }}
                  </v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top color="blue">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="blue" size="23px" class="mr-1" v-bind="attrs" v-on="on" @click="editItem(item)">
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
import BookDataService from '../services/BookDataService'
import PublisherDataService from '../services/PublisherDataService'
import moment from 'moment'

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    menu: false,
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    nowDate: new Date().toISOString().slice(0, 10),
    search: '',
    awaitBook: true,
    headers: [
      {
        text: 'Id',
        align: 'start',
        value: 'id',
      },
      { text: 'Nome', value: 'name' },
      { text: 'Autor', value: 'author' },
      { text: 'Editora', value: 'publisher.name' },
      { text: 'Data de lançamento', value: 'launch' },
      { text: 'Quantidade', value: 'quantity' },
      { text: 'Ações', align: 'center', value: 'actions', sortable: false }
    ],
    books: [],
    publishers: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      author: '',
      publisherId: '',
      publisher: '',
      launch: '',
      quantity: 0,
    },
    defaultItem: {
      name: '',
      author: '',
      publisherId: '',
      publisher: '',
      launch: '',
      quantity: 0,
    },
    rules: {
      required: value => !!value || 'Campo obrigatorio.',
      counter_book: value => value.length <= 120 || 'Max 120 caracteres.',
      counter_author: value => value.length <= 35 || 'Max 35 caracteres.',
      min_number: value => value >= 0 ||  'Quantity invalid.',
      min_counter: value => value.length >= 3 || 'Min 3 caracteres.',
    },
    valid: false,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Livro' : 'Editar Livro'
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
    async listBooks() {
      this.awaitBook = true
      await BookDataService.getAll()
        .then((response) => {
          this.books = response.data;
          this.books.forEach((item) => {
            item.launch = this.listDate(item.launch)
          })
          this.awaitBook = false
          console.log(response.data);
        })
        .catch((e) => {
          this.awaitBook = true
          console.log(e);
        });
    },

    async listPublisher() {
      this.awaitBook = true
      await PublisherDataService.getAll()
        .then((response) => {
          this.publishers = response.data;
          this.awaitBook = false
          console.log(response.data);
        })
        .catch((e) => {
          this.awaitBook = true
          console.log(e);
        });
    },

    listDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },

    editDate(date) {
      const [dd, mm, yyyy] = date.split('/');
      return `${yyyy}-${mm}-${dd}`    
    },

    getColor(quantity) {
      if (quantity < 10) return 'red'
      else if (quantity < 50) return 'orange'
      else return 'green'
    },

    editItem(item) {
      this.editedIndex = item.id
      this.editedItem = Object.assign({}, item)
      this.editedItem.launch = this.editDate(this.editedItem.launch)
      this.dialog = true
    },

    deleteItem(item) {
      this.deletedIndex = item.id
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.BookDelete()
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
          this.BookUpdate()
        } else {
          this.BookPost()
        }
      }
    },

    async BookPost() {
      this.awaitBook = true
      await BookDataService.create(this.editedItem).then(() => this.listBooks()).then(() => this.showAlertSuccessPost()).then(() => this.awaitBook = false).then(() => this.close())
        .catch((e) => {
          this.showAlertError1()
          this.awaitBook = false
          console.log(e)
        });
    },

    async BookUpdate() {
      this.awaitBook = true
      await BookDataService.update(this.editedIndex, this.editedItem).then(() => this.listBooks()).then(() => this.showAlertSuccessUpdate()).then(() => this.awaitBook = false).then(() => this.close())
        .catch((e) => {
          this.showAlertError1()
          this.awaitBook = false
          console.log(e)
        });
    },

    async BookDelete() {
      await BookDataService.delete(this.deletedIndex).then(() => this.listBooks()).then(() => this.showAlertSuccessDelete())
        .catch((e) => {
          this.showAlertError2()
          console.log(e)
        })
    },

    showAlertSuccessPost() {
      this.$swal("", "Livro cadastrado com sucesso!", "success");
    },

    showAlertSuccessUpdate() {
      this.$swal("", "Livro atualizado com sucesso!", "success");
    },

    showAlertSuccessDelete() {
      this.$swal("", "Livro deletado com sucesso!", "success");
    },

    showAlertError1() {
      this.$swal("Oops...", "Algum erro aconteceu!", "error");
    },

    showAlertError2() {
      this.$swal("Oops...", "Esse livro está alugado!", "error");
    },

  },

  mounted() {
    this.listBooks();
    this.listPublisher();
  }
}
</script>

<style>
.round {
  border-radius: 30px;
}
</style>