<template>
    <v-app>
        <v-main class="blue">
            <v-container class="mb-15">
                <v-row>
                    <v-col cols="3">
                        <CardUser></CardUser>
                    </v-col>
                    <v-col cols="3">
                        <CardBook></CardBook>
                    </v-col>
                    <v-col cols="3">
                        <CardPublisher></CardPublisher>
                    </v-col>
                    <v-col cols="3">
                        <CardRental></CardRental>
                    </v-col>
                    <v-col cols="6">
                        <Scoreboard></Scoreboard>
                    </v-col>
                    <v-col cols="6">
                        <Card></Card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import CardRental from '@/components/dashboard/CardRental.vue';
import CardPublisher from '@/components/dashboard/CardPublisher.vue';
import CardBook from '@/components/dashboard/CardBook.vue';
import CardUser from '@/components/dashboard/CardUser.vue';
import Scoreboard from '@/components/dashboard/Scoreboard.vue';
import Card from '@/components/dashboard/Card.vue';


export default {
    components: { CardRental, CardPublisher, CardBook, CardUser, Scoreboard, Card }
}
</script>