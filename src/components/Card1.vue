<template>
    <div class="d-flex justify-center">
        <v-card class="justify-center my-7" shaped width="50%" style="border: 1px solid #1d87b5" min-height="130"
            rounded="lg">
            <v-card-text class="d-flex justify-space-between">
                <div>
                    Último Livro alugado:
                    <h1 class="my-1">{{ this.ultimoLivroAluguel }}</h1>
                </div>

                <div class="">
                    <v-avatar class="mx-2 my-3" color="blue" size="3.500em" right>
                        <v-icon size="30px" color="white"> mdi-book </v-icon>
                    </v-avatar>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import RentalDataService from '../services/RentalDataService';

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