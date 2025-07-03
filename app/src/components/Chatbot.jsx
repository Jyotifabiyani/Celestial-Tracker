import React, { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello! I'm your space assistant. Ask me anything about astronomy!",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      setTimeout(() => {
        const botResponse = generateResponse(message);
        setMessages(prev => [...prev, {
          message: botResponse,
          sender: "ChatGPT",
          direction: "incoming"
        }]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
    }
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    const spaceKnowledge = {
      planets: {
        mercury: {
          facts: [
            "Closest planet to the Sun",
            "No substantial atmosphere",
            "Surface temperature ranges from -173°C to 427°C",
            "Orbital period: 88 Earth days",
            "Has water ice in permanently shadowed craters"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/mercury-messenger-globe-pia15162-800x800.jpg"
        },
        venus: {
          facts: [
            "Hottest planet with average temperature of 464°C",
            "Rotates backwards (retrograde rotation)",
            "A day on Venus is longer than its year",
            "Atmosphere is 96.5% carbon dioxide",
            "Surface pressure is 92 times Earth's"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/venus-magellan-colorized-800x800.jpg"
        },
        earth: {
          facts: [
            "Only known planet with life",
            "71% of surface covered by water",
            "Atmosphere is 78% nitrogen, 21% oxygen",
            "Only natural satellite: the Moon",
            "Tilted 23.5° on its axis, causing seasons"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/earth-blue-marble-800x800.jpg"
        },
        mars: {
          facts: [
            "Known as the Red Planet due to iron oxide",
            "Home to Olympus Mons, the tallest volcano",
            "Has two moons: Phobos and Deimos",
            "Evidence of ancient water flows",
            "Current NASA missions: Perseverance rover"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/mars-globe-valles-marineris-enhanced-800x800.jpg"
        },
        jupiter: {
          facts: [
            "Largest planet in solar system",
            "Great Red Spot is a centuries-old storm",
            "Has at least 79 moons",
            "Strongest magnetic field of any planet",
            "Day lasts only 10 hours"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/jupiter-new-horizons-800x800.jpg"
        },
        saturn: {
          facts: [
            "Known for its spectacular ring system",
            "Rings are made mostly of ice particles",
            "Least dense planet (would float in water)",
            "Has 82 confirmed moons",
            "Wind speeds can reach 1,800 km/h"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/saturn-cassini-800x800.jpg"
        },
        uranus: {
          facts: [
            "Rotates on its side (98° tilt)",
            "Coldest planetary atmosphere (-224°C)",
            "Has 13 known rings",
            "Takes 84 Earth years to orbit the Sun",
            "Methane gives it blue-green color"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/uranus-voyager-800x800.jpg"
        },
        neptune: {
          facts: [
            "Windiest planet with supersonic winds",
            "Discovered through mathematical prediction",
            "Has 14 known moons",
            "Great Dark Spot similar to Jupiter's storm",
            "Farthest planet from the Sun (usually)"
          ],
          image: "https://science.nasa.gov/wp-content/uploads/2023/09/neptune-voyager-800x800.jpg"
        }
      },
      moon: {
        facts: [
          "Diameter: 3,474 km (about 1/4 Earth's)",
          "Average distance: 384,400 km from Earth",
          "Gravity: 1/6th of Earth's",
          "Surface temperature: -173°C to 127°C",
          "No substantial atmosphere",
          "Next lunar eclipse: [check NASA's calendar]"
        ],
        phases: [
          "New Moon",
          "Waxing Crescent",
          "First Quarter",
          "Waxing Gibbous",
          "Full Moon",
          "Waning Gibbous",
          "Last Quarter",
          "Waning Crescent"
        ],
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/moon-apollo-800x800.jpg"
      },
      telescope: {
        beginner: [
          "**Entry-level telescopes:**",
          "- Celestron AstroMaster 70AZ ($200-300)",
          "- Orion StarBlast 4.5 ($200-250)",
          "- Meade Infinity 70mm ($150-200)",
          "",
          "**Tips:**",
          "- Start with moon observation",
          "- Learn constellations first",
          "- Avoid high magnification claims",
          "- Consider light pollution in your area"
        ],
        advanced: [
          "**Intermediate/Advanced options:**",
          "- Dobsonian telescopes (great light gathering)",
          "- Computerized GoTo telescopes",
          "- Astrophotography setups",
          "",
          "**Features to consider:**",
          "- Aperture size (more important than magnification)",
          "- Mount stability",
          "- Portability needs"
        ],
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/hubble-telescope-800x800.jpg"
      },
      events: {
        upcoming: [
          "**Next major celestial events:**",
          "- Perseid Meteor Shower: August 11-13, 2025",
          "- Total Lunar Eclipse: March 14, 2025",
          "- Jupiter at Opposition: September 2025",
          "- Next Full Moon: " + new Date(new Date().setDate(new Date().getDate() + 29.5)).toLocaleDateString(),
          "",
          "**Annual Events:**",
          "- Lyrids Meteor Shower (April)",
          "- Geminids Meteor Shower (December)",
          "- Summer/Winter Solstice",
          "- Spring/Fall Equinox"
        ],
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/meteor-shower-800x800.jpg"
      },
      missions: {
        nasa: [
          "**Current NASA Missions:**",
          "- Artemis Program (Moon exploration)",
          "- Perseverance Rover (Mars)",
          "- James Webb Space Telescope",
          "- Parker Solar Probe",
          "- Europa Clipper (upcoming)",
          "",
          "**Notable Past Missions:**",
          "- Apollo Moon Landings",
          "- Hubble Space Telescope",
          "- Voyager 1 & 2",
          "- Cassini (Saturn)"
        ],
        spacex: [
          "**SpaceX Recent/Upcoming:**",
          "- Starship development",
          "- Starlink satellite launches",
          "- Crew Dragon (ISS missions)",
          "- Lunar tourism missions (planned)"
        ],
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/artemis-800x800.jpg"
      },
      astrophysics: {
        stars: [
          "**Star Facts:**",
          "- Our Sun is a G-type main-sequence star",
          "- Stars are classified by temperature (O, B, A, F, G, K, M)",
          "- Nearest star system: Alpha Centauri (4.37 light-years)",
          "- Supernovae create heavy elements"
        ],
        galaxies: [
          "**Galaxy Information:**",
          "- Milky Way is a barred spiral galaxy",
          "- Andromeda is our closest galactic neighbor",
          "- Galaxies contain billions of stars",
          "- Three main types: spiral, elliptical, irregular"
        ],
        blackholes: [
          "**Black Hole Facts:**",
          "- Form from collapsed massive stars",
          "- Event horizon is the point of no return",
          "- Supermassive black holes exist at galaxy centers",
          "- First image captured in 2019 (M87*)"
        ],
        image: "https://science.nasa.gov/wp-content/uploads/2023/09/black-hole-800x800.jpg"
      }
    };

    if (/(planet|mars|venus|mercury|jupiter|saturn|uranus|neptune|earth)/i.test(lowerMessage)) {
      const planetMatch = Object.keys(spaceKnowledge.planets).find(planet => 
        lowerMessage.includes(planet)
      );
      
      if (planetMatch) {
        const planet = spaceKnowledge.planets[planetMatch];
        return `**${planetMatch.charAt(0).toUpperCase() + planetMatch.slice(1)} Facts**\n\n` +
               `${planet.facts.map(fact => `- ${fact}`).join('\n')}\n\n` +
               `![${planetMatch}](${planet.image})`;
      } else {
        return "**Solar System Planets**\n\n" +
          Object.keys(spaceKnowledge.planets).map((planet, i) => 
            `${i+1}. ${planet.charAt(0).toUpperCase() + planet.slice(1)}`
          ).join('\n') +
          "\n\nWhich planet would you like to know about?";
      }
    }
    else if (/(moon|lunar|phases)/i.test(lowerMessage)) {
      if (lowerMessage.includes("phase") || lowerMessage.includes("phases")) {
        return "**Moon Phases**\n\n" +
               spaceKnowledge.moon.phases.map((phase, i) => 
                 `${i+1}. ${phase}`
               ).join('\n') +
               `\n\n![Moon phases](${spaceKnowledge.moon.image})`;
      } else {
        return "**Moon Facts**\n\n" +
               spaceKnowledge.moon.facts.map(fact => `- ${fact}`).join('\n') +
               `\n\n![Moon](${spaceKnowledge.moon.image})`;
      }
    }
    else if (/(telescope|binoculars|observe|viewing)/i.test(lowerMessage)) {
      if (lowerMessage.includes("beginner") || lowerMessage.includes("start")) {
        return spaceKnowledge.telescope.beginner.join('\n') +
               `\n\n![Telescope](${spaceKnowledge.telescope.image})`;
      } else {
        return spaceKnowledge.telescope.advanced.join('\n') +
               `\n\n![Telescope](${spaceKnowledge.telescope.image})`;
      }
    }
    else if (/(event|meteor|eclipse|shower|upcoming)/i.test(lowerMessage)) {
      return spaceKnowledge.events.upcoming.join('\n') +
             `\n\n![Celestial event](${spaceKnowledge.events.image})`;
    }
    else if (/(nasa|spacex|mission|rover|artemis)/i.test(lowerMessage)) {
      if (lowerMessage.includes("spacex") || lowerMessage.includes("elon")) {
        return spaceKnowledge.missions.spacex.join('\n') +
               `\n\n![Space mission](${spaceKnowledge.missions.image})`;
      } else {
        return spaceKnowledge.missions.nasa.join('\n') +
               `\n\n![NASA mission](${spaceKnowledge.missions.image})`;
      }
    }
    else if (/(star|constellation|galaxy|nebula|black hole|neutron star)/i.test(lowerMessage)) {
      if (lowerMessage.includes("black hole")) {
        return spaceKnowledge.astrophysics.blackholes.join('\n') +
               `\n\n![Black hole](${spaceKnowledge.astrophysics.image})`;
      } else if (lowerMessage.includes("galaxy")) {
        return spaceKnowledge.astrophysics.galaxies.join('\n') +
               `\n\n![Galaxy](${spaceKnowledge.astrophysics.image})`;
      } else {
        return spaceKnowledge.astrophysics.stars.join('\n') +
               `\n\n![Star](${spaceKnowledge.astrophysics.image})`;
      }
    }
    else if (/(hello|hi|hey)/i.test(lowerMessage)) {
      return "Hello space enthusiast! 🚀 I'm your astronomy assistant. Ask me about:\n\n" +
             "- Planets and moons\n- Space telescopes\n- Celestial events\n- NASA missions\n- Stars and galaxies\n- Black holes\n\n" +
             "What would you like to learn about today?";
    }
    else if (/(thank|thanks|appreciate)/i.test(lowerMessage)) {
      return "You're welcome! Remember, the universe is full of wonders to explore. 🪐 Let me know if you have any other space questions!";
    }
    else if (/(who are you|what are you)/i.test(lowerMessage)) {
      return "I'm your personal Space Knowledge Assistant! 🤖✨ My purpose is to help you explore and understand the wonders of the universe, from our solar system to distant galaxies.";
    }
    else {
      return `I'm not sure I understand your question about space. Here are some topics I can help with:\n\n` +
             `- **Planet facts**: "Tell me about Mars", "What's special about Saturn's rings?"\n` +
             `- **Moon information**: "What are the moon phases?", "How far is the Moon?"\n` +
             `- **Telescopes**: "Best telescope for beginners", "How to view Jupiter?"\n` +
             `- **Space missions**: "Current NASA missions", "What is Artemis?"\n` +
             `- **Celestial events**: "When is the next meteor shower?", "Upcoming eclipses"\n` +
             `- **Astrophysics**: "What is a black hole?", "Types of galaxies"\n\n` +
             `Try asking about one of these topics!`;
    }
  };

  return (
    <div style={{ 
      position: "relative", 
      height: "90vh", 
      width: "100%",
      overflow: "hidden"
    }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={isTyping ? <TypingIndicator content="Assistant is typing..." /> : null}
            scrollBehavior="smooth"
          >
            {messages.map((msg, i) => (
              <Message
                key={i}
                model={{
                  message: msg.message,
                  sentTime: msg.sentTime,
                  sender: msg.sender,
                  direction: msg.direction,
                  position: "single"
                }}
              >
                <Message.CustomContent>
                  <ReactMarkdown 
                    components={{
                      img: ({node, ...props}) => (
                        <img 
                          {...props} 
                          style={{
                            maxWidth: '100%', 
                            borderRadius: '8px',
                            marginTop: '8px',
                            display: 'block'
                          }} 
                          alt="space imagery"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ),
                      p: ({node, ...props}) => <p {...props} style={{margin: '4px 0'}} />,
                      ul: ({node, ...props}) => <ul {...props} style={{margin: '4px 0', paddingLeft: '20px'}} />,
                      li: ({node, ...props}) => <li {...props} style={{marginBottom: '4px'}} />
                    }}
                  >
                    {msg.message}
                  </ReactMarkdown>
                </Message.CustomContent>
              </Message>
            ))}
          </MessageList>
          <MessageInput 
            placeholder="Ask me about planets, space events..." 
            onSend={handleSend} 
            attachButton={false}
            style={{
              padding: "10px",
              borderTop: "1px solid #eee"
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}