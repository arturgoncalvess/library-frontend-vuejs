<template>
    <v-container class="mt-5">
        <v-row>
            <v-card class="pa-1" color="pink darken-1" elevation="13" rounded="xl">
                <v-row>
                    <v-col cols="12" sm="8">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <div class="mb-4">
                                    <v-btn fab color="pink lighten-2" elevation="0" to="/book">
                                        <v-icon color="white">mdi-book</v-icon>
                                    </v-btn>
                                </div>
                                <v-list-item-title class="headline mb-1 white--text">
                                    {{ quantBook }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="white--text">Número de livros
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-avatar size="105" class="ml-n8 mt-6" tile>
                            <v-img src="@/assets/img/book-outline.png"></v-img>
                        </v-avatar>
                    </v-col>
                </v-row>
            </v-card>
        </v-row>
    </v-container>
</template>
<script>
import BookDataService from '@/services/BookDataService';

export default {
    data: () => ({
        books: [],
        quantBook: []
    }),
    methods: {
        listar() {
            BookDataService.getAll().then((resposta) => {
                this.books = resposta.data;
                this.quantBook = this.books.length;
            });
        }
    },
    mounted() {
        this.listar();
    },
}
</script>
<style scoped>

</style>