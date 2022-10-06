<template>
    <v-container class="mt-5">
        <v-card color="blue darken-1" elevation="13" rounded="xl">
            <v-card-title class="headline white--text">Livro alugado recentemente</v-card-title>
            <div class="white">
                <v-col>
                    <v-card-text>
                        <li>
                            <span v-if="this.ultimoLivroAluguel.length > 0">{{ this.ultimoLivroAluguel }}</span>
                            <span v-else>---</span>
                        </li>
                    </v-card-text>
                </v-col>
            </div>
        </v-card>
    </v-container>
</template>
<script>
import RentalDataService from '@/services/RentalDataService';

export default {
    data: () => ({
        rentals: [],
        ultimoAluguel: [],
        ultimoLivroAluguel: []
    }),
    methods: {
        listar() {
            RentalDataService.getAll().then((resposta) => {
                console.log('Rentals', resposta.data);
                this.rentals = resposta.data;
                this.ultimoAluguel = this.rentals[this.rentals.length - 1];
                this.ultimoLivroAluguel = this.ultimoAluguel.book.name;
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