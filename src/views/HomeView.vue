<template>
    <v-app>
        <v-main class="blue">
            <v-container>
                <v-row>
                    <v-col cols="3">
                        <v-sheet rounded="xl" elevation="15" class="d-flex justify-center">
                            <Card1></Card1>
                        </v-sheet>
                    </v-col>
                    <v-col cols="3">
                        <v-sheet rounded="xl" elevation="15" class="d-flex justify-center">
                            <Card2></Card2>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Card1 from '../components/Card1.vue';
import Card2 from '../components/Card2.vue';

export default {
    components: { Card1, Card2 }
}
</script>