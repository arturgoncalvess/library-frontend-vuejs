<template>
  <v-app>
    <v-main class="blue">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet rounded="xl" elevation="15">
              <v-data-table :headers="headers" :items="rentals" :search="search" loading="items"
                loading-text="Carregando dados... Aguarde!" no-data-text="Nenhum usuário encontrado."
                :footer-props="{itemsPerPageText: 'Linhas por página'}" class="rounded-xl pa-3">

                <template v-slot:top>
                  <v-toolbar flat class="rounded-xl rounded-b-0">
                    <v-toolbar-title class="headline"><span>Aluguéis</span></v-toolbar-title>

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
                              <v-select v-model="editedItem.userId" :items="users" item-text="name" item-value="id"
                                label="Usuário" color="blue" :rules="[rules.required]" append-icon="mdi-account">
                              </v-select>

                              <v-select v-model="editedItem.bookId" :items="books" item-text="name" item-value="id"
                                label="Livro" color="blue" :rules="[rules.required]" append-icon="mdi-book-account">
                              </v-select>

                              <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false"
                                :return-value.sync="date" transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="editedItem.rental_Date" label="Data de aluguel" color="blue"
                                    :rules="[rules.required]" append-icon="mdi-calendar-today-outline" readonly
                                    v-bind="attrs" v-on="on">
                                  </v-text-field>
                                </template>

                                <v-date-picker v-model="editedItem.rental_Date" locale="pt-br" no-title scrollable color="blue"
                                  :max="nowDate">

                                  <v-spacer></v-spacer>

                                  <v-btn text @click="menu1 = false"> Cancelar </v-btn>
                                  <v-btn text color="blue" @click="$refs.menu1.save(editedItem.rental_Date)">
                                    OK
                                  </v-btn>
                                </v-date-picker>

                              </v-menu>

                              <v-menu ref="menu2" v-model="menu2" :close-on-content-click="false"
                                :return-value.sync="date" transition="scale-transition" offset-y min-width="auto">

                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field v-model="editedItem.forecast_Date" label="Previsão de devolução"
                                    color="blue" :rules="[rules.required]" append-icon="mdi-calendar-outline" readonly
                                    v-bind="attrs" v-on="on">
                                  </v-text-field>
                                </template>

                                <v-date-picker v-model="editedItem.forecast_Date" locale="pt-br" no-title scrollable color="blue"
                                  :min="nowDate">

                                  <v-spacer></v-spacer>

                                  <v-btn text @click="menu2 = false"> Cancelar </v-btn>
                                  <v-btn text color="blue" @click="$refs.menu2.save(editedItem.forecast_Date)">
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
                            <v-btn color="blue darken-1" class="mb-2 mr-2" text @click="savePost"
                              :disabled="awaitRental">
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

                        <v-card-title class="headline">
                          <v-spacer></v-spacer> <span class="mt-2 mb-4">Devolver o livro</span>
                          <v-spacer></v-spacer>
                        </v-card-title>

                        <v-card-actions>

                          <v-spacer></v-spacer>

                          <v-btn color="red darken-1" class="mb-2" text @click="close">
                            Cancelar
                          </v-btn>
                          <v-btn color="blue darken-1" class="mb-2" text @click="saveUpdate" :disabled="awaitRental">
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

                <template v-slot:[`item.status_Rental`]="{ item }">
                  <v-chip class="elevation-3" :color="getColor(item)" dark>
                    {{ item.status_Rental }}
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
import moment from 'moment'

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
    awaitRental: true,
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
      { text: 'Status', align: 'center', value: 'status_Rental', sortable: false },
      { text: 'Ações', align: 'center', value: 'actions', sortable: false },
    ],
    rentals: [],
    users: [],
    books: [],
    editedIndex: -1,
    editedItem: {
      userId: '',
      bookId: '',
      rental_Date: '',
      forecast_Date: '',
      return_Date: '',
      returned_Book: '',
    },
    devolutionItem: {
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
      return moment(date).format('DD/MM/YYYY');
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
      this.awaitRental = true
      await RentalDataService.getAll()
        .then((response) => {
          this.rentals = response.data;
          this.awaitRental = false
          console.log(response.data);
        })
        .catch((e) => {
          this.awaitRental = true
          console.log(e);
        });
    },

    async listUsers() {
      this.awaitRental = true
      await UserDataService.getAll()
        .then((response) => {
          this.users = response.data;
          this.awaitRental = false
          console.log(response.data);
        })
        .catch((e) => {
          this.awaitRental = true
          console.log(e);
        });
    },

    async listBooks() {
      this.awaitRental = true
      await BookDataService.getAvailable()
        .then((response) => {
          this.books = response.data;
          this.awaitRental = false
          console.log(response.data);
        })
        .catch((e) => {
          this.awaitRental = true
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
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    editItem(item) {
      this.editedIndex = item.id
      this.devolutionItem.return_Date = this.nowDate
      this.devolutionItem.returned_Book = true
      this.dialog2 = true
    },

    deleteItem(item) {
      this.deletedIndex = item.id
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.RentalDelete()
      this.closeDelete()
    },

    close(a) {
      if (a) {
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        this.$refs.form.resetValidation()
        this.dialog = false
      } else {
        this.$nextTick(() => {
          this.devolutionItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        this.dialog2 = false
      }
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.deletedIndex = -1
      })
    },

    savePost() {
      if (this.$refs.form.validate()) {
        if (this.editedItem.forecast_Date < this.editedItem.rental_Date) {
          this.showAlertErrorPost2()
        } else if (this.editedItem.rental_Date > this.editedItem.forecast_Date) {
          this.showAlertErrorPost3()
        } else {
          this.RentalPost()
        }
      }
    },

    saveUpdate() {
      this.RentalUpdate()
    },

    async RentalPost() {
      this.awaitRental = true
      await RentalDataService.create(this.editedItem).then(() => this.listRentals()).then(() => this.listBooks()).then(() => this.showAlertSuccessPost()).then(() => this.close(true))
        .catch((e) => {
          this.showAlertErrorPost1()
          this.awaitRental = false
          console.log(e)
        });
    },

    async RentalUpdate() {
      this.awaitRental = true
      await RentalDataService.update(this.editedIndex, this.devolutionItem).then(() => this.listRentals()).then(() => this.listBooks()).then(() => this.showAlertSuccessDevolution()).then(() => this.awaitRental = false).then(() => this.close(false))
        .catch((e) => {
          this.close()
          this.showAlertErrorUpdate1()
          console.log(e)
        });
    },

    async RentalDelete() {
      await RentalDataService.delete(this.deletedIndex).then(() => this.listRentals()).then(() => this.listBooks()).then(() => this.showAlertSuccessDelete())
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