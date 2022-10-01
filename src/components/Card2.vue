<template>
    <v-card class="justify-center my-6" shaped width="85%" style="border:2px solid #147DD9" min-height="130"
        rounded="lg">
        <v-card-title>
            O livro mais alugado:
        </v-card-title>
        <v-card-text>
            <span>{{ this.firstBook }}</span><br>
            <span>{{ this.secundBook }}</span><br>
            <span>{{ this.tercBook }}</span>
        </v-card-text>
    </v-card>
</template>
<script>
import BookDataService from '../services/BookDataService';

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
                this.firstBook = this.books[0].name;
                this.secundBook = this.books[1].name;
                this.tercBook = this.books[2].name;
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