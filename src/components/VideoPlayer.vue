<template>

	<div class="closed-modal">
		<PlayCircleOutlined class="playing-icon" @click="openModal"/>
	</div>

	<Modal
		v-model:open="isModalOpened"
		:width="videoWidth"
		title="PLAYER"
		@ok="closeModal"
	>
		<template #footer>
			<Button @click="toggleModal">
				<template #icon>
					<ArrowsAltOutlined v-if="isDefaultSize" />
					<ShrinkOutlined v-else />
				</template>
			</Button>

			<Button @click="handleVideo">
				<template #icon>
					<CaretRightFilled v-if="isPlayingVideo" />
					<PauseOutlined v-else />
				</template>
			</Button>

		</template>
		<video
			class="block-video"
		>
			<source src="/video-source.mp4" type="video/mp4" />
			Ваш браузер не поддерживает видео.
		</video>
	</Modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMachine } from '@xstate/vue';
import { Button, Modal } from 'ant-design-vue';
import { CaretRightFilled, ShrinkOutlined, PauseOutlined, ArrowsAltOutlined, PlayCircleOutlined } from '@ant-design/icons-vue';
import { videoPlayerMachine } from '@/machines/playerMachine.js';

const { snapshot, send } = useMachine(videoPlayerMachine);

const isModalOpened = ref(false);

const isPlayingVideo = computed(() => {
  return snapshot.value.context.playingVideo;
});

const modalOpenedSize = computed(() => {
	return snapshot.value.value?.opened?.size;
});

const isDefaultSize = computed(() => {
	return !!modalOpenedSize.value && modalOpenedSize.value !== 'default';
});

const videoWidth = computed(() => {
	return isDefaultSize.value ? 500 : 1000;
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
	send(isDefaultSize.value ? { type: 'TOGGLE_DEFAULT' } : { type: 'TOGGLE_SMALLER' });
};

const handleVideo = () => {
	send(isPlayingVideo.value ? { type: 'TOGGLE_PAUSE' } : { type: 'TOGGLE_PLAY' });
};

</script>

<style scoped>
.closed-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #8585ff;
    border-radius: 5px;
    height: 150px;
    width: 300px;
    margin: 25vh auto auto
}

.playing-icon {
    font-size: 50px;
    color: #8585ff
}

.block-video {
		width: 100%;
		height: 100%;
}
</style>