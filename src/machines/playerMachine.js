import { createMachine, assign } from 'xstate';
import { TYPE_MACHINE } from '@/utils/constants.js';

export const videoPlayerMachine = createMachine({
	id: 'modalWithVideo',
	initial: 'closed',
	context: { playingVideo: false },
	states: {
		closed: {
			on: {
				[TYPE_MACHINE.OPEN_MODAL]: {
					target: 'opened',
					actions: 'playVideo'
				}
			}
		},
		opened: {
			type: 'parallel',
			states: {
				size: {
					initial: 'default',
					states: {
						default: {
							on: {
								[TYPE_MACHINE.TOGGLE_SMALLER]: 'smaller',
							}
						},
						smaller: {
							on: {
								[TYPE_MACHINE.TOGGLE_DEFAULT]: 'default'
							}
						}
					}
				},
				player: {
					initial: 'play',
					states: {
						play: {
							on: {
								[TYPE_MACHINE.TOGGLE_PAUSE]: {
									target: 'pause',
									actions: 'pauseVideo'
								},
							}
						},
						pause: {
							on: {
								[TYPE_MACHINE.TOGGLE_PLAY]: {
									target: 'play',
									actions: 'playVideo'
								}
							}
						}
					}
				},
			},
			on: {
				[TYPE_MACHINE.CLOSE_MODAL]: {
					target: 'closed',
					actions: 'pauseVideo'
				}
			}
		}
	},
},
{
	actions: {
		playVideo: assign({ playingVideo: (context) => context.playingVideo = true }),
		pauseVideo: assign({ playingVideo: (context) => context.playingVideo = false }),
	}
});