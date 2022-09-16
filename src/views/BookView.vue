<template>
  <v-app>
    <v-main class="deep-purple darken-3">
      <v-container>
        <v-row>
          <v-col>
            <v-sheet min-height="70vh">
              <v-data-table :headers="headers" :items="books" :search="search" class="elevation-1">
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>Livros</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-dialog v-model="dialog" max-width="500px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn color="deep-purple darken-3" dark v-bind="attrs" v-on="on">
                          Novo
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Nome"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Cidade"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Endereço"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Email"></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="red darken-1" text @click="close">
                            Cancel
                          </v-btn>
                          <v-btn color="blue darken-1" text @click="save">
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
                    </v-text-field>
                  </v-toolbar>
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
import BookDataService from '../services/BookDataService.js'


export default {
  name: "BookView",
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Id',
          align: 'start',
          value: 'id',
          class: 'deep-purple darken-4, white--text'
        },
        { text: 'Nome', value: 'name', class: 'deep-purple darken-4, white--text' },
        { text: 'Autor', value: 'author', class: 'deep-purple darken-4, white--text' },
        { text: 'Editora', value: 'publisher.name', class: 'deep-purple darken-4, white--text' },
        { text: 'Lançamento', value: 'launch', class: 'deep-purple darken-4, white--text' },
        { text: 'Quantidade', value: 'quantity', class: 'deep-purple darken-4, white--text' },
        { text: 'Ações', sortable: false, value: 'actions', class: 'deep-purple darken-4, white--text' },
      ],
      books: [],
    }
  },

  methods: {
    retrieveBooks() {
      BookDataService.getAll()
        .then((response) => {
          this.books = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    initialize() {
      this.books = []
    },

    created() {
      this.initialize()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },

  mounted() {
    this.retrieveBooks();
  },
};
</script>
  
<style>

</style>