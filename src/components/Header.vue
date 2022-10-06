<template>
    <v-app-bar app>
        <v-container class="py-0 fill-height">
            <v-toolbar-title class="headline text-uppercase">
                <span>Livraria</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn class="mr-2" active-class="blue white--text elevation-5" text to="/">
                <v-icon size="24px"> mdi-home </v-icon> Home
            </v-btn>
            <v-btn class="mr-2" active-class="blue white--text elevation-5" text to="/user">
                <v-icon size="24px"> mdi-account </v-icon> Usuário
            </v-btn>
            <v-btn class="mr-2" active-class="blue white--text elevation-5" text to="/book">
                <v-icon size="21px"> mdi-book </v-icon> Livro
            </v-btn>
            <v-btn class="mr-2" active-class="blue white--text elevation-5" text to="/publisher">
                <v-icon size="24px"> mdi-bookshelf </v-icon> Editora
            </v-btn>
            <v-btn active-class="blue white--text elevation-5" text to="/rental">
                <v-icon size="21px"> mdi-book-account </v-icon> Aluguel
            </v-btn>

            <v-spacer></v-spacer>
        </v-container>
    </v-app-bar>
</template>

<script>
export default {

}
</script>

<style>
    span{
        font-family: 'Fira Code', monospace;
    }
</style>