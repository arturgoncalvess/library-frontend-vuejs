<template>
    <v-container class="mt-5">
        <v-row>
            <v-card class="pa-1" color="cyan darken-1" elevation="13" rounded="xl">
                <v-row>
                    <v-col cols="12" sm="8">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <div class="mb-4">
                                    <v-btn fab color="cyan lighten-2" elevation="0" to="/user">
                                        <v-icon color="white" size="30px">mdi-account</v-icon>
                                    </v-btn>
                                </div>
                                <v-list-item-title class="headline mb-1 white--text">
                                    {{ quantUser }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="white--text">Número de usuários
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-avatar size="115" class="img__avatar ml-n14 mt-4" tile>
                            <v-img src="@/assets/img/account-outline.png"></v-img>
                        </v-avatar>
                    </v-col>
                </v-row>
            </v-card>
        </v-row>
    </v-container>
</template>
<script>
import UserDataService from '@/services/UserDataService';

export default {
    data: () => ({
        users: [],
        quantUser: []
    }),
    methods: {
        listar() {
            UserDataService.getAll().then((resposta) => {
                this.users = resposta.data;
                this.quantUser = this.users.length;
            });
        }
    },
    mounted() {
        this.listar();
    },
}
</script>
<style scoped>
    @media (max-width: 700px) {
        .img__avatar{
            display: none;
        }
    }
</style>