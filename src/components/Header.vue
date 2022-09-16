<template>
    <v-app-bar app color="dark">
        <v-container class="py-0 fill-height">
            <v-toolbar-title class="headline text-uppercase">
                <span><b> WDA </b></span>
                <span class="font-weight-ligt">Livraria</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn class="mr-2" active-class="deep-purple darken-5 white--text" text to="/">
                <v-icon size="20px"> mdi-home </v-icon> Inicio
            </v-btn>
            <v-btn class="mr-2" active-class="deep-purple darken-5  white--text" text to="/user">
                <v-icon size="20px"> mdi-account-edit </v-icon> Cliente
            </v-btn>
            <v-btn class="btn__link mr-2" active-class="deep-purple darken-5 white--text" text to="/book">
                <v-icon size="20px"> mdi-book-plus </v-icon> Livro
            </v-btn>
            <v-btn class="mr-2" active-class="deep-purple darken-5 white--text" text to="/publisher">
                <v-icon size="20px"> mdi-bookshelf </v-icon> Editora
            </v-btn>
            <v-btn active-class="deep-purple darken-5 white--text" text to="/rental">
                <v-icon size="20px"> mdi-book-account </v-icon> Aluguel
            </v-btn>

            <v-spacer></v-spacer>

            <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="100" offset-x>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn rounded color="deep-purple accent-2" dark v-bind="attrs" v-on="on">
                        <v-icon size="25px"> mdi-theme-light-dark </v-icon>
                    </v-btn>
                </template>

                <v-card>
                    <v-list class="d-flex">
                        <v-list-item>
                            <v-list-item-action>
                                <v-switch v-model="$vuetify.theme.dark" inset persistent-hint
                                    color="deep-purple accent-2"></v-switch>
                            </v-list-item-action>
                            <v-list-item-title>Modo Escuro</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>
        </v-container>
    </v-app-bar>
</template>

<script>
export default {
    data: () => ({

    })
};
</script>

<style>
    
</style>