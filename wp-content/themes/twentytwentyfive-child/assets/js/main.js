/**
 * Portfolio front-end behaviour.
 *
 * Mobile nav, sticky header state, scroll reveal, active section highlighting,
 * project filtering and the back-to-top button.
 */
( function () {
	'use strict';

	var reduceMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* --- Mobile navigation ---------------------------------------------- */

	var burger = document.querySelector( '.nt-burger' );
	var nav    = document.getElementById( 'nt-nav' );

	function closeNav() {
		if ( ! burger || ! nav ) {
			return;
		}
		nav.classList.remove( 'is-open' );
		burger.setAttribute( 'aria-expanded', 'false' );
		burger.setAttribute( 'aria-label', 'Open menu' );
	}

	if ( burger && nav ) {
		burger.addEventListener( 'click', function () {
			var open = nav.classList.toggle( 'is-open' );
			burger.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
			burger.setAttribute( 'aria-label', open ? 'Close menu' : 'Open menu' );
		} );

		nav.addEventListener( 'click', function ( event ) {
			if ( event.target.closest( 'a' ) ) {
				closeNav();
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' === event.key ) {
				closeNav();
			}
		} );

		document.addEventListener( 'click', function ( event ) {
			if ( nav.classList.contains( 'is-open' ) &&
				! nav.contains( event.target ) &&
				! burger.contains( event.target ) ) {
				closeNav();
			}
		} );

		window.addEventListener( 'resize', function () {
			if ( window.innerWidth > 900 ) {
				closeNav();
			}
		} );
	}

	/* --- Sticky header + back to top ------------------------------------ */

	var header = document.getElementById( 'nt-header' );
	var toTop  = document.querySelector( '.nt-top' );
	var ticking = false;

	function onScroll() {
		var y = window.scrollY || window.pageYOffset;

		if ( header ) {
			header.classList.toggle( 'is-stuck', y > 8 );
		}
		if ( toTop ) {
			toTop.classList.toggle( 'is-visible', y > 600 );
		}

		ticking = false;
	}

	window.addEventListener( 'scroll', function () {
		if ( ! ticking ) {
			window.requestAnimationFrame( onScroll );
			ticking = true;
		}
	}, { passive: true } );

	onScroll();

	if ( toTop ) {
		toTop.addEventListener( 'click', function () {
			window.scrollTo( {
				top: 0,
				behavior: reduceMotion ? 'auto' : 'smooth'
			} );
		} );
	}

	/* --- Reveal on scroll ----------------------------------------------- */

	var revealItems = document.querySelectorAll( '.nt-reveal' );

	if ( revealItems.length ) {
		if ( reduceMotion || ! ( 'IntersectionObserver' in window ) ) {
			revealItems.forEach( function ( el ) {
				el.classList.add( 'is-visible' );
			} );
		} else {
			var revealObserver = new IntersectionObserver( function ( entries ) {
				entries.forEach( function ( entry, index ) {
					if ( ! entry.isIntersecting ) {
						return;
					}
					var delay = Math.min( index * 70, 280 );
					window.setTimeout( function () {
						entry.target.classList.add( 'is-visible' );
					}, delay );
					revealObserver.unobserve( entry.target );
				} );
			}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' } );

			revealItems.forEach( function ( el ) {
				revealObserver.observe( el );
			} );
		}
	}

	/* --- Active section in the nav -------------------------------------- */

	var navLinks = Array.prototype.slice.call( document.querySelectorAll( '.nt-nav__link[data-section]' ) );
	var sections = navLinks
		.map( function ( link ) {
			return document.getElementById( link.getAttribute( 'data-section' ) );
		} )
		.filter( Boolean );

	if ( sections.length && 'IntersectionObserver' in window ) {
		var setActive = function ( id ) {
			navLinks.forEach( function ( link ) {
				link.classList.toggle( 'is-active', link.getAttribute( 'data-section' ) === id );
			} );
		};

		var sectionObserver = new IntersectionObserver( function ( entries ) {
			var visible = entries
				.filter( function ( entry ) {
					return entry.isIntersecting;
				} )
				.sort( function ( a, b ) {
					return b.intersectionRatio - a.intersectionRatio;
				} );

			if ( visible.length ) {
				setActive( visible[ 0 ].target.id );
			}
		}, { threshold: [ 0.15, 0.4 ], rootMargin: '-90px 0px -45% 0px' } );

		sections.forEach( function ( section ) {
			sectionObserver.observe( section );
		} );
	}

	/* --- Project filters ------------------------------------------------ */

	var filters = document.querySelectorAll( '.nt-filter' );
	var cards   = document.querySelectorAll( '#nt-projects .nt-card--project' );

	if ( filters.length && cards.length ) {
		filters.forEach( function ( button ) {
			button.addEventListener( 'click', function () {
				var value = button.getAttribute( 'data-filter' );

				filters.forEach( function ( other ) {
					other.classList.toggle( 'is-active', other === button );
				} );

				cards.forEach( function ( card ) {
					var show = 'all' === value || card.getAttribute( 'data-platform' ) === value;
					card.classList.toggle( 'is-hidden', ! show );

					// Replay the reveal animation for cards coming back into view.
					if ( show && ! reduceMotion ) {
						card.classList.remove( 'is-visible' );
						window.requestAnimationFrame( function () {
							card.classList.add( 'is-visible' );
						} );
					}
				} );
			} );
		} );
	}

	/* --- Keep the sticky header clear of hash targets ------------------- */

	if ( window.location.hash ) {
		window.setTimeout( function () {
			var target = document.querySelector( window.location.hash );
			if ( target ) {
				target.scrollIntoView( { behavior: 'auto', block: 'start' } );
			}
		}, 60 );
	}
}() );
