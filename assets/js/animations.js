window.animations = [];

function parseAnimation(an) {
	const pos = document.getElementById(an.container).getBoundingClientRect();
	const animations = [];

	for (let i = 0; i < Math.floor(pos.height); i++) {
		animations[i] = an.style(i / pos.height);
	}

	return animations
		.map((item, index) => ({
			pos: Math.floor(pos.top + index + window.scrollY),
			animation: item,
			selectors: an.selectors.map(i => document.querySelector(i))
		}));
}

function buildAnimationList() {    
    window.animations = [];
    
	[{
			container: 'sec2',
			selectors: ['#sec2 > .staticImage'],
			style: pos => ({
				filter: `brightness(${Math.max(0, pos)})`
			})
		},
		{
			container: 'sec1',
			selectors: ['#sec1 > .titleContent'],
			style: pos => ({
				transform: `scale(${Math.min(1, (1 - pos))})`,
			})
		},
	]
	.map(parseAnimation)
		.flat()
		.forEach(item => {
			if (!window.animations[item.pos]) {
				window.animations[item.pos] = [];
			}
			window.animations[item.pos].push(item);
		});
}

function subscribeAnimationFrame() {
	window.requestAnimationFrame(_ => {
		const pos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (window.animations[pos]) {
            window.animations[pos]
                .forEach(item => {
                item.selectors.forEach(el => {
                    Object.assign(el.style, item.animation);
                })
            });
        }

		subscribeAnimationFrame();
	})
}

function bootstrapAnimation(){    
    buildAnimationList();
    subscribeAnimationFrame();

    window.addEventListener('resize', _ => {
        console.log('resize');
        buildAnimationList();
    });
}

(() => {
    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', _ => {
            bootstrapAnimation();
        });
    }
    else {
        bootstrapAnimation();
    }   
})();
