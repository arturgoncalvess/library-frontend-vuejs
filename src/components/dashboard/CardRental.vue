<template>
    <v-container class="mt-5">
        <v-row>
            <v-card class="pa-1" color="grey darken-1" elevation="13" rounded="xl">
                <v-row>
                    <v-col cols="12" sm="8">
                        <v-list-item three-line>
                            <v-list-item-content>
                                <div class="mb-4">
                                    <v-btn fab color="grey" elevation="0" to="/rental">
                                        <v-icon color="white">mdi-book-account</v-icon>
                                    </v-btn>
                                </div>
                                <v-list-item-title class="headline mb-1 white--text">
                                    {{ quantRental }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="white--text">Número de aluguéis
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-avatar size="110" class="ml-n16 mt-5" tile>
                            <v-img src="@/assets/img/rent-outline.png"></v-img>
                        </v-avatar>
                    </v-col>
                </v-row>
            </v-card>
        </v-row>
    </v-container>
</template>
<script>
import RentalDataService from '@/services/RentalDataService';

export default {
    data: () => ({
        rentals: [],
        quantRental: []
    }),
    methods: {
        listar() {
            RentalDataService.getAll().then((resposta) => {
                this.rentals = resposta.data;
                this.quantRental = this.rentals.length;
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