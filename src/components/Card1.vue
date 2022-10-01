<template>
    <v-card class="justify-center my-6" shaped width="85%" style="border:2px solid #147DD9" min-height="130"
        rounded="lg">
        <v-card-title>
            Último livro alugado:
        </v-card-title>
        <v-card-text>
            <span>{{ this.ultimoLivroAluguel }}</span>
        </v-card-text>
    </v-card>
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