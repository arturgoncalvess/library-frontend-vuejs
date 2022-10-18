<template>
    <div>
        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = true" class="d-flex d-sm-none mr-n3"></v-app-bar-nav-icon>

            <v-toolbar-title class="headline text-uppercase">
                <span><strong class="blue--text">WDA</strong> Livraria</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-items v-model="tab" align-with-title class="d-none d-sm-flex">

                <div class="mt-3 mr-2">
                    <v-btn active-class="blue white--text elevation-5" text to="/">
                        <v-icon size="24px"> mdi-home </v-icon> Home
                    </v-btn>
                </div>
                <div class="mt-3 mr-2">
                    <v-btn active-class="blue white--text elevation-5" text to="/user">
                        <v-icon size="24px"> mdi-account </v-icon> Usuário
                    </v-btn>
                </div>
                <div class="mt-3 mr-2">
                    <v-btn active-class="blue white--text elevation-5" text to="/book">
                        <v-icon size="21px"> mdi-book </v-icon> Livro
                    </v-btn>
                </div>
                <div class="mt-3 mr-2">
                    <v-btn active-class="blue white--text elevation-5" text to="/publisher">
                        <v-icon size="24px"> mdi-bookshelf </v-icon> Editora
                    </v-btn>
                </div>
                <div class="mt-3 mr-2">
                    <v-btn active-class="blue white--text elevation-5" text to="/rental">
                        <v-icon size="21px"> mdi-book-account </v-icon> Aluguel
                    </v-btn>
                </div>

            </v-toolbar-items>

        </v-app-bar>

        <v-navigation-drawer v-model="drawer" temporary app>
             <v-list-item-content class="my-2 pa-3">
                <v-list-item-title class="text-h6">
                    <strong class="blue--text">WDA</strong> Livraria
                </v-list-item-title>
                <v-list-item-subtitle>
                    Olá, Bem-vindo(a)!
                </v-list-item-subtitle>
            </v-list-item-content>

            <v-divider class="my-3"></v-divider>

            <v-list nav dense>
                <v-list-item v-for="(item, i) in items" :key="i" :to="item.link" link>
                    <v-list-item-icon>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{item.text}}</v-list-item-title>
                </v-list-item>
            </v-list>

            <v-divider class="my-5"></v-divider>

        </v-navigation-drawer>

    </div>

</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            tab: null,
            items: [
                {
                    icon: 'mdi-home',
                    text: 'Home',
                    link: '/',
                },
                {
                    icon: 'mdi-account',
                    text: 'Usuário',
                    link: '/user',
                },
                {
                    icon: 'mdi-book',
                    text: 'Livro',
                    link: '/book',
                },
                {
                    icon: 'mdi-bookshelf',
                    text: 'Editora',
                    link: '/publisher',
                },
                {
                    icon: 'mdi-book-account',
                    text: 'Aluguel',
                    link: '/rental',
                },
            ],
        }
    }
}
</script>

<style>
span {
    font-family: 'Fira Code', monospace;
}
</style>