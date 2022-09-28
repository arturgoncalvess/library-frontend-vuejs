<template>
    <v-app>
        <v-main class="blue">
            <v-container>
                <v-row>
                    <v-col cols="3">
                        <v-sheet rounded="xl" elevation="15">
                            <Card1></Card1>
                        </v-sheet>
                    </v-col>
                    <v-col cols="5">
                        <v-sheet rounded="xl" elevation="15" class="pa-3">
                            <Bar></Bar>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Bar from '../components/Bar.vue';
import Card1 from '../components/Card1.vue';

export default {
    components: { Bar, Card1 }
}
</script>