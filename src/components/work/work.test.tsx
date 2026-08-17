import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ProjectCard from './ProjectCard';
import TabPanels from './TabPanels';
import TabLinks from './TabLinks';
import YouTubeEmbed, { timecodeToSeconds } from './YouTubeEmbed';
import { projectBySlug } from '@/data/projects';

const featured = projectBySlug('roster-reveal-split-two')!;
const plainMontage = projectBySlug('radiant-run-act-iii')!;
const poster = projectBySlug('clash-cup-finals')!;

describe('timecodeToSeconds', () => {
  it.each([
    ['0:00', 0],
    ['0:38', 38],
    ['1:24', 84],
    ['2:41', 161],
    ['1:00:00', 3600],
  ])('converts %s to %i seconds', (timecode, seconds) => {
    expect(timecodeToSeconds(timecode)).toBe(seconds);
  });
});

describe('ProjectCard', () => {
  it('links to the case study when the piece has one', () => {
    render(<ProjectCard project={featured} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', `/work/${featured.slug}`);
  });

  it('does not link a piece with no case study', () => {
    render(<ProjectCard project={poster} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows the duration pill only when there is a duration', () => {
    const { unmount } = render(<ProjectCard project={plainMontage} />);
    expect(screen.getByText(plainMontage.duration!)).toBeInTheDocument();
    unmount();

    render(<ProjectCard project={poster} />);
    expect(screen.queryByText(/^\d+:\d{2}$/)).not.toBeInTheDocument();
  });

  it('inverts the pill for the featured piece', () => {
    render(<ProjectCard project={featured} />);
    expect(screen.getByText(`Featured · ${featured.duration}`)).toBeInTheDocument();
  });

  it('renders the archive alt text, not a filename', () => {
    render(<ProjectCard project={plainMontage} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', plainMontage.alt);
  });

  it('honours `plain`, so the reel row does not get a full-width banner', () => {
    const { container } = render(<ProjectCard project={featured} plain />);
    const media = container.querySelector('[class*="media"]') as HTMLElement;
    // `plain` forces the ordinary card ratio instead of the 32:9 banner.
    expect(media.style.getPropertyValue('--aspect')).toBe('');
    expect(container.querySelector('[class*="featured"]')).toBeNull();
  });

  it('shows the case-study affordance only when asked', () => {
    const { unmount } = render(<ProjectCard project={featured} showCaseLink />);
    expect(screen.getByText(/case study/i)).toBeInTheDocument();
    unmount();

    render(<ProjectCard project={featured} />);
    expect(screen.queryByText(/case study/i)).not.toBeInTheDocument();
  });

  it('becomes a player, not a link, when the piece has a video', () => {
    // Video must win over the case-study link, or the anchor swallows the
    // play button and the video can never be started.
    render(<ProjectCard project={{ ...featured, youtubeId: 'abcdefghijk' }} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });
});

describe('YouTubeEmbed', () => {
  it('loads no iframe until the visitor presses play', () => {
    const { container } = render(<YouTubeEmbed videoId="abcdefghijk" title="A montage" />);
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('injects a privacy-preserving, autoplaying iframe on click', async () => {
    const user = userEvent.setup();
    const { container } = render(<YouTubeEmbed videoId="abcdefghijk" title="A montage" />);

    await user.click(screen.getByRole('button', { name: /play/i }));

    const iframe = container.querySelector('iframe')!;
    expect(iframe).toBeInTheDocument();
    expect(iframe.getAttribute('src')).toContain('youtube-nocookie.com/embed/abcdefghijk');
    expect(iframe.getAttribute('src')).toContain('autoplay=1');
    expect(iframe).toHaveAttribute('title', 'A montage');
  });

  it('seeks to the chapter offset when given one', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <YouTubeEmbed videoId="abcdefghijk" title="Chapter" startSeconds={84} />,
    );

    await user.click(screen.getByRole('button', { name: /play/i }));

    expect(container.querySelector('iframe')!.getAttribute('src')).toContain('start=84');
  });

  it('names the video in the play button for screen readers', () => {
    render(<YouTubeEmbed videoId="abcdefghijk" title="Radiant Run" />);
    expect(screen.getByRole('button', { name: 'Play Radiant Run' })).toBeInTheDocument();
  });
});

describe('TabPanels (home filter)', () => {
  const tabs = [
    { id: 'a', label: 'Montages' },
    { id: 'b', label: 'Posters' },
    { id: 'c', label: 'Ads' },
  ];
  const panels = {
    a: <div>panel a</div>,
    b: <div>panel b</div>,
    c: <div>panel c</div>,
  };

  const setup = () => render(<TabPanels tabs={tabs} panels={panels} label="Filter work" />);

  it('shows the first panel by default', () => {
    setup();
    expect(screen.getByText('panel a')).toBeVisible();
    expect(screen.getByText('panel b')).not.toBeVisible();
  });

  it('switches panels on click', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('tab', { name: 'Posters' }));

    expect(screen.getByText('panel b')).toBeVisible();
    expect(screen.getByText('panel a')).not.toBeVisible();
  });

  it('exposes correct tab semantics', () => {
    setup();
    expect(screen.getByRole('tablist')).toHaveAccessibleName('Filter work');
    expect(screen.getByRole('tab', { name: 'Montages' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('keeps only the selected tab in the tab order', () => {
    setup();
    expect(screen.getByRole('tab', { name: 'Montages' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Posters' })).toHaveAttribute('tabindex', '-1');
  });

  it('moves between tabs with arrow keys and wraps around', async () => {
    const user = userEvent.setup();
    setup();

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Montages' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Posters' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Ads' })).toHaveAttribute('aria-selected', 'true');
  });

  it('jumps to the ends with Home and End', async () => {
    const user = userEvent.setup();
    setup();

    await user.tab();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Ads' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Montages' })).toHaveAttribute('aria-selected', 'true');
  });

  it('labels each panel by its tab', () => {
    setup();
    const panel = screen.getByRole('tabpanel');
    const labelledBy = panel.getAttribute('aria-labelledby')!;
    expect(document.getElementById(labelledBy)).toHaveTextContent('Montages');
  });
});

describe('TabLinks (work filter)', () => {
  const tabs = [
    { id: 'all', label: 'All work' },
    { id: 'montage', label: 'Montages' },
    { id: 'poster', label: 'Posters' },
  ];

  it('renders real links, so filtered views are shareable and work without JS', () => {
    render(<TabLinks tabs={tabs} active="all" label="Filter" />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('keeps /work canonical for the default tab', () => {
    render(<TabLinks tabs={tabs} active="all" label="Filter" />);
    expect(screen.getByRole('link', { name: 'All work' })).toHaveAttribute('href', '/work');
  });

  it('adds a filter param for the others', () => {
    render(<TabLinks tabs={tabs} active="all" label="Filter" />);
    expect(screen.getByRole('link', { name: 'Montages' })).toHaveAttribute(
      'href',
      '/work?filter=montage',
    );
  });

  it('marks the active tab as the current page', () => {
    render(<TabLinks tabs={tabs} active="poster" label="Filter" />);
    expect(screen.getByRole('link', { name: 'Posters' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Montages' })).not.toHaveAttribute('aria-current');
  });
});
