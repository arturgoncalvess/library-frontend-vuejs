<template>
    <v-container class="mt-5">
        <v-card color="blue darken-1" elevation="13" rounded="xl">
            <v-card-title class="headline white--text">Top 3 livros mais alugados</v-card-title>
            <div class="white">
                <v-col>
                    <v-card-text v-if="this.firstBook.maxRented > 0">
                        <li>
                            <span>{{ this.firstBook.name }}</span>
                        </li>
                    </v-card-text>
                    <v-card-text v-if="this.secundBook.maxRented > 0">
                        <li>
                            <span>{{ this.secundBook.name }}</span>
                        </li>
                    </v-card-text>
                    <v-card-text v-if="this.tercBook.maxRented > 0">
                        <li>
                            <span>{{ this.tercBook.name }}</span>
                        </li>
                    </v-card-text>
                </v-col>
            </div>
        </v-card>
    </v-container>
</template>
<script>
import BookDataService from '@/services/BookDataService';

export default {
    data: () => ({
        books: [],
        firstBook: [],
        secundBook: [],
        tercBook: []
    }),
    methods: {
        listar() {
            BookDataService.getMaxRented().then((resposta) => {
                this.books = resposta.data;
                if (this.books[0] != null) {
                    this.firstBook = this.books[0];
                } else {
                    this.firstBook = '...'
                }
                if (this.books[1] != null) {
                    this.secundBook = this.books[1];
                } else {
                    this.secundBook = '...'
                }
                if (this.books[2] != null) {
                    this.tercBook = this.books[2];
                } else {
                    this.tercBook = '...'
                }
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