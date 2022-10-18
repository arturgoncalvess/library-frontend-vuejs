<template>
    <v-card class="mx-auto pa-1" color="pink darken-1" max-width="350" elevation="13" rounded="xl" outlined>
        <v-list-item three-line>
            <v-list-item-content>
                <div class="mb-4">
                    <v-btn fab class="img__avatar" color="pink lighten-2" elevation="0" to="/user">
                        <v-icon color="white" size="30px">mdi-book</v-icon>
                    </v-btn>
                </div>
                <v-list-item-title class="headline mb-1 white--text">{{ quantBook }}</v-list-item-title>
                <v-list-item-subtitle class="white--text mb-1">
                    Número de livros
                </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar class="avatar__img mt-6" tile size="120">
                <v-img src="@/assets/img/book-outline.png"></v-img>
            </v-list-item-avatar>
        </v-list-item>
    </v-card>
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
@media (min-width: 960px) and (max-width: 1263px){
    .avatar__img{
        display: none;
    }
}
</style>