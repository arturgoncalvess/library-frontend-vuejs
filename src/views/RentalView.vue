<template>
  <v-app>
    <v-main class="blue">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet rounded="xl" elevation="15">
              <v-data-table :headers="headers" :items="rentals" :search="search" class="rounded-xl pa-3">

                <template v-slot:top>
                  <v-toolbar flat class="rounded-xl rounded-b-0">
                    <v-toolbar-title class="headline"><span>Alugueis</span></v-toolbar-title>

                    <v-divider class="mx-4" inset vertical></v-divider>

                    <v-dialog v-model="dialog" max-width="500px" persistent content-class="round">

                      <template v-slot:activator="{ on, attrs }">
                        <v-btn class="elevation-5" color="blue" dark v-bind="attrs" v-on="on">
                          Novo
                          <v-icon class="ml-1">mdi-plus</v-icon>
                        </v-btn>
                      </template>

                      <v-card>
                        <v-form ref="form" v-model="valid" lazy-validation>
                          <v-card-title class="headline">
                            <span class="ml-3 mt-2">Novo Aluguel</span>
                          </v-card-title>

                          <v-spacer></v-spacer>

                          <v-card-text>
                            <v-container>
                              <v-select v-model="editedItem1.userId" :items="users" item-text="name" item-value="id"
                                label="Usuário" color="blue" :rules="[rules.required]" append-icon="mdi-account">
                              </v-select>

                              <v-select v-model="editedItem1.bookId" :items="books" item-text="name" item-value="id"
                                label="Livro" color="blue" :rules="[rules.required]" append-icon="mdi-book-account">
                              </v-select>

                              <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false"
                                :return-value.sync="date" transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="editedItem1.rental_Date" label="Data de aluguel" color="blue"
                                    :rules="[rules.required]" append-icon="mdi-calendar-today-outline" readonly
                                    v-bind="attrs" v-on="on">
                                  </v-text-field>
                                </template>

                                <v-date-picker v-model="editedItem1.rental_Date" no-title scrollable color="blue"
                                  :max="nowDate">

                                  <v-spacer></v-spacer>

                                  <v-btn text @click="menu1 = false"> Cancelar </v-btn>
                                  <v-btn text color="blue" @click="$refs.menu1.save(editedItem1.rental_Date)">
                                    OK
                                  </v-btn>
                                </v-date-picker>

                              </v-menu>

                              <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false"
                                :return-value.sync="date" transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="editedItem1.forecast_Date" label="Previsão de devolução"
                                    color="blue" :rules="[rules.required]" append-icon="mdi-calendar-outline" readonly
                                    v-bind="attrs" v-on="on">
                                  </v-text-field>
                                </template>

                                <v-date-picker v-model="editedItem1.forecast_Date" no-title scrollable color="blue"
                                  :min="nowDate">

                                  <v-spacer></v-spacer>

                                  <v-btn text @click="menu2 = false"> Cancelar </v-btn>
                                  <v-btn text color="blue" @click="$refs.menu2.save(editedItem1.forecast_Date)">
                                    OK
                                  </v-btn>
                                </v-date-picker>

                              </v-menu>
                            </v-container>
                          </v-card-text>

                          <v-card-actions>

                            <v-spacer></v-spacer>

                            <v-btn color="red darken-1" class="mb-2" text @click="close">
                              Cancelar
                            </v-btn>
                            <v-btn color="blue darken-1" class="mb-2 mr-2" text @click="save">
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

                    <v-dialog v-model="dialog2" max-width="370px" persistent content-class="round">
                      <v-card>

                        <v-card-title class="headline"> <v-spacer></v-spacer> <span class="mt-2 mb-4">Devolver o livro</span> <v-spacer></v-spacer> </v-card-title>

                        <v-card-actions>

                          <v-spacer></v-spacer>

                          <v-btn color="red darken-1" class="mb-2" text @click="close">
                            Cancelar
                          </v-btn>
                          <v-btn color="blue darken-1" class="mb-2" text @click="save">
                            Ok
                          </v-btn>

                          <v-spacer></v-spacer>

                        </v-card-actions>

                      </v-card>
                    </v-dialog>

                    <v-spacer></v-spacer>

                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Pesquisar" color="blue" single-line
                      hide-details></v-text-field>
                  </v-toolbar>
                </template>

                <template v-slot:[`item.rental_Date`]="{ item }">
                  {{ item.rental_Date | FormatDate }}
                </template>

                <template v-slot:[`item.forecast_Date`]="{ item }">
                  {{ item.forecast_Date | FormatDate }}
                </template>

                <template v-slot:[`item.return_Date`]="{ item }">
                  <span v-if="item.returned_Book">{{ item.return_Date | FormatDate }}</span>
                  <span v-else>Sem data</span>
                </template>

                <template v-slot:[`item.status`]="{ item }">
                  <v-chip class="elevation-3" :color="getColor(item)" dark>
                    <span v-if="item.return_Date <= item.forecast_Date && item.return_Date >= item.rental_Date">
                      No prazo
                    </span>
                    <span v-else-if="item.return_Date > item.forecast_Date">Com atraso</span>
                    <span v-else>Com pendência</span>
                  </v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top color="red" v-if="item.returned_Book">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="red" size="23px" v-bind="attrs" v-on="on" @click="deleteItem(item)">
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>Excluir</span>
                  </v-tooltip>
                  <v-tooltip top color="orange" v-else>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon color="orange" size="23px" v-bind="attrs" v-on="on" @click="editItem(item)">
                        mdi-book-check
                      </v-icon>
                    </template>
                    <span>Devolver</span>
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
import RentalDataService from '../services/RentalDataService'
import UserDataService from '../services/UserDataService'
import BookDataService from '../services/BookDataService'
import moment, { now } from 'moment'

export default {
  data: () => ({
    dialog: false,
    dialog2: false,
    dialogDelete: false,
    menu1: false,
    menu2: false,
    menu3: false,
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    nowDate: new Date().toISOString().slice(0, 10),
    search: '',
    headers: [
      {
        text: 'Id',
        align: 'start',
        value: 'id',
      },
      { text: 'Usuário', value: 'user.name' },
      { text: 'Livro', value: 'book.name' },
      { text: 'Data do aluguel', value: 'rental_Date' },
      { text: 'Previsão de devolução', value: 'forecast_Date' },
      { text: 'Data de devolução', value: 'return_Date' },
      { text: 'Status', align: 'center', value: 'status', sortable: false },
      { text: 'Ações', align: 'center', value: 'actions', sortable: false },
    ],
    rentals: [],
    users: [],
    books: [],
    editedIndex: -1,
    editedItem1: {
      userId: '',
      bookId: '',
      rental_Date: '',
      forecast_Date: '',
      return_Date: '',
      returned_Book: '',
    },
    editedItem2: {
      return_Date: '',
      returned_Book: '',
    },
    defaultItem: {
      userId: '',
      bookId: '',
      rental_Date: '',
      forecast_Date: '',
      return_Date: '',
      returned_Book: '',
    },
    rules: {
      required: value => !!value || 'Campo obrigatorio.',
    },
    valid: false,
  }),


  filters: {
    FormatDate: date => {
      return moment(date).format('YYYY-MM-DD');
    }
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
    async listRentals() {
      await RentalDataService.getAll()
        .then((response) => {
          this.rentals = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async listUsers() {
      await UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async listBooks() {
      await BookDataService.getAll()
        .then((response) => {
          this.books = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getColor(item) {
      if (item.return_Date <= item.forecast_Date && item.return_Date >= item.rental_Date) return 'green'
      else if (item.return_Date > item.forecast_Date) return 'red'
      else return 'gray'
    },

    newItem(item) {
      this.editedIndex = item.id
      this.editedItem1 = Object.assign({}, item)
      this.dialog = true
    },

    editItem(item) {
      this.editedIndex = item.id
      this.editedItem1 = Object.assign({}, item)
      this.dialog2 = true
    },

    deleteItem(item) {
      this.editedIndex = item.id
      this.editedItem1 = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.rentals.splice(this.editedIndex, 1)
      this.RentalDelete()
      this.closeDelete()
      this.close()
    },

    close() {
      this.dialog = false
      this.dialog2 = false
      this.$nextTick(() => {
        this.editedItem1 = Object.assign({}, this.defaultItem)
        this.editedItem2 = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem1 = Object.assign({}, this.defaultItem)
        this.editedItem2 = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        this.editedItem2.return_Date = this.date
        this.editedItem2.returned_Book = true
        this.RentalUpdate()
      } else {
        if (this.$refs.form.validate()) {
          if (this.editedItem1.forecast_Date < this.editedItem1.rental_Date) {
            this.showAlertErrorPost2()
          } else if (this.editedItem1.rental_Date > this.editedItem1.forecast_Date) {
            this.showAlertErrorPost3()
          } else {
            this.RentalPost()
          }
        }
      }
    },

    async RentalPost() {
      await RentalDataService.create(this.editedItem1).then(() => this.listRentals()).then(() => this.showAlertSuccessPost()).then(() => this.close())
        .catch((e) => {
          this.showAlertErrorPost1()
          console.log(e)
        });
    },

    async RentalUpdate() {
      await RentalDataService.update(this.editedIndex, this.editedItem2).then(() => this.listRentals()).then(() => this.showAlertSuccessDevolution()).then(() => this.close())
        .catch((e) => {
          this.showAlertErrorUpdate1()
          console.log(e)
        });
    },

    async RentalDelete() {
      await RentalDataService.delete(this.editedIndex).then(() => this.listRentals()).then(() => this.showAlertSuccessDelete())
        .catch((e) => {
          this.showAlertErrorDelete()
          console.log(e)
        })
    },

    showAlertSuccessPost() {
      this.$swal("", "Aluguel cadastrado com sucesso!", "success");
    },

    showAlertSuccessDevolution() {
      this.$swal("", "Livro devolvido com sucesso!", "success");
    },

    showAlertSuccessDelete() {
      this.$swal("", "Aluguel deletado com sucesso!", "success");
    },

    showAlertErrorPost1() {
      this.$swal("Oops...", "Esse livro está em falta no momento.", "error");
    },

    showAlertErrorPost2() {
      this.$swal("Oops...", "Previsão de Devolução não pode ser anterior a data de Aluguel!", "error");
    },

    showAlertErrorPost3() {
      this.$swal("Oops...", "Data Aluguel não pode ser superior a previsão de Devolução!", "error");
    },

    showAlertErrorPost3() {
      this.$swal("Oops...", "Data Aluguel não pode ser inferior ao dias úteis!", "error");
    },

    showAlertErrorUpdate1() {
      this.$swal("Oops...", "Algum erro aconteceu!", "error");
    },

    showAlertErrorUpdate2() {
      this.$swal("Oops...", "Data de Devolução não pode ser anterior a data de Aluguel!", "error");
    },

    showAlertErrorDelete() {
      this.$swal("Oops...", "Algum erro aconteceu!", "error");
    },

  },

  mounted() {
    this.listRentals();
    this.listUsers();
    this.listBooks();
  }
}
</script>

<style>
.round {
  border-radius: 30px;
}
</style>