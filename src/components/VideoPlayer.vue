<template>
	<div>
		<button @click="openModal">Открыть видео</button>
		<div v-if="isModalOpened" class="modal">
			<div>
				<video
					v-if="isPlayingVideo"
					controls
					:width="videoWidth"
				>
					<source src="/video-source.mp4" type="video/mp4" />
					Ваш браузер не поддерживает видео.
				</video>
				<div class="controls">
					<button @click="playingVideo">
						{{ isPlayingVideo ? 'Пауза' : 'Воспроизвести' }}
					</button>
					<button @click="toggleModal">Изменить размер</button>
					<button @click="closeModal">Закрыть</button>
				</div>
			</div>
		</div>
	</div>
	{{snapshot}}
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMachine } from '@xstate/vue';
import { videoPlayerMachine } from '@/machines/playerMachine.js';

const { snapshot, send } = useMachine(videoPlayerMachine);

const isModalOpened = ref(false);

const isPlayingVideo = computed(() => {
  return snapshot.value.context.playingVideo;
});

const modalOpenedSize = computed(() => {
	return snapshot.value.value?.opened?.size;
});

const videoWidth = computed(() => {
	return !!modalOpenedSize.value && modalOpenedSize.value !== 'default'
		? 500
		: 1000;
});

const openModal = () => {
	send({ type: 'OPEN_MODAL' });
	isModalOpened.value = true;
};

const closeModal = () => {
	send({ type: 'CLOSE_MODAL' });
	isModalOpened.value = false;
};

const toggleModal = () => {
	send(!!modalOpenedSize.value && modalOpenedSize.value !== 'default'
		? { type: 'TOGGLE_DEFAULT' }
		: { type: 'TOGGLE_SMALLER' });
};

const playingVideo = () => {
	send(isPlayingVideo.value
		? { type: 'TOGGLE_PAUSE' }
		: { type: 'TOGGLE_PLAY' });
};

</script>

<style scoped>

</style>